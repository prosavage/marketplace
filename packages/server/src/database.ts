import {
  RESOURCES_COLLECTION,
  REVIEWS_COLLECTION,
  SELLER_COLLECTION,
  TOKENS_COLLECTION,
  VERSIONS_COLLECTION,
} from "./constants";
import { getDatabase, tokenMap } from "./server";
import { Resource } from "./types/Resource";
import { Review } from "./types/Review";

const ensureIndexes = async () => {
  // indexes will only build if they do not exist.
  // for page based searching with no filters...
  await getDatabase()
    .collection(RESOURCES_COLLECTION)
    .createIndex({ updated: -1 });
  // for page search based on type only.
  await getDatabase().collection(RESOURCES_COLLECTION).createIndex({ type: 1 });
  // for page search based on type + category
  await getDatabase()
    .collection(RESOURCES_COLLECTION)
    .createIndex({ type: 1, category: 1 });

  // resource indexer for reviews.
  await getDatabase()
    .collection(REVIEWS_COLLECTION)
    .createIndex({ resource: 1 });
  // resource indexer for versions.
  await getDatabase()
    .collection(VERSIONS_COLLECTION)
    .createIndex({ resource: 1 });

  // indexer for timestamp to get last updated.
  await getDatabase()
    .collection(VERSIONS_COLLECTION)
    .createIndex({ timestamp: -1 });

  // indexer for tokens so they can be searched?
  // we do not really use it but a useful one to have in prod.
  await getDatabase().collection(TOKENS_COLLECTION).createIndex({ token: 1 });


  // indexer for searching sellers through user.
  await getDatabase().collection(SELLER_COLLECTION).createIndex({ user: 1 });
};

export const pageSearchCollectionWithFilter = async (
  collection: string,
  filter: object,
  page: number
) => {
  const limit = 10;
  return await getDatabase()
    .collection(collection)
    .find(filter)
    .sort({ updated: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
};

// Rating is pretty simple.
// Pure avg of the user's ratings.
export const updateResourceRating = async (resourceId: Resource["_id"]) => {
  const reviews = await getDatabase()
    .collection<Review>(REVIEWS_COLLECTION)
    .find({ resource: resourceId })
    .toArray();
  if (!reviews) {
    console.log(
      `Resource ${resourceId}'s update was cancelled due to no reviews being found.`
    );
    return;
  }

  const authors = new Set(reviews.map((review) => review.author));
  const calculatedReviews: Review[] = [];
  for (const author of authors) {
    const authorReviews = reviews.filter((user) => user.author === author);
    const latestReview = authorReviews.sort((a, b) =>
      a.timestamp < b.timestamp ? 1 : -1
    )[0];
    if (!latestReview) {
      console.log("review for", author, "not found");
      continue;
    }
    calculatedReviews.push(latestReview);
  }

  const sum =
    calculatedReviews.length > 0
      ? calculatedReviews
          .map((review) => review.rating)
          .reduce((total, current) => total + current)
      : 0;
  const avg = Math.round(sum / calculatedReviews.length);
  await getDatabase()
    .collection(RESOURCES_COLLECTION)
    .updateOne({ _id: resourceId }, { $set: { rating: avg } });
};

export const readTokens = async () => {
  const tokens = await getDatabase()
    .collection(TOKENS_COLLECTION)
    .find()
    .toArray();
  tokens.forEach((token) => {
    tokenMap.set(token.token, token.user);
  });
  console.log(`Read ${tokenMap.size} from database into token cache.`);
};

export default ensureIndexes;
