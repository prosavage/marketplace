import express, { Request, Response } from "express";
import morgan from "morgan";
import mongodb, { ObjectId } from "mongodb";
import dotenv from "dotenv";
import { User } from "./types/User";
import authRouter from "./routes/AuthRouter";
import resourceRouter from "./routes/resources/ResourceRouter";
import categoryRouter from "./routes/CategoryRouter";
import versionRouter from "./routes/VersionRouter";
import betterResponse from "./middleware/ResponseFunctions";
import directoryRouter from "./routes/directory/DirectoryRouter";
import ensureIndexes, { readTokens } from "./database";
import reviewRouter from "./routes/ReviewRouter";
import { BunnyCDNStorage } from "./bunnycdn";
import fileUpload from "express-fileupload";
import cors from "cors";
import userIconRouter from "./routes/UserRouter";
import { RESOURCES_COLLECTION, REVIEWS_COLLECTION } from "./constants";

dotenv.config();

const mongoClient = new mongodb.MongoClient(
  process.env.MONGODB_URL || "mongodb://localhost:27017",
  { useUnifiedTopology: true }
);
export const getDatabase = () => {
  return mongoClient.db(process.env.MONGODB_DB_NAME || "marketplace");
};

export const tokenMap = new Map<string, User["_id"]>([
  // temp perma token for dev
  ["hehexddd", new ObjectId("5fe53ce6ffa79fc6331f8ab4")],
]);

// clear dev tokens if running in prod.
if (process.env.NODE_ENV === "production") {
  tokenMap.clear();
  console.log("RUNNING IN PRODUCTION MODE, CLEARED DEV TOKENS.");
} else {
  console.log("RUNNING IN DEVELOPEMNT MODE.");
}

export const bunny = new BunnyCDNStorage();

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(morgan("tiny"));
app.use(betterResponse);
app.use("/auth", authRouter);
app.use("/users/icon", userIconRouter);
app.use("/resources", resourceRouter);
app.use("/category", categoryRouter);
app.use("/directory", directoryRouter);
app.use("/version", versionRouter);
app.use("/review", reviewRouter);

app.get("/", (_req: Request, res: Response) => {
  res.success({ hello: "there!" });
});

console.log("starting...");
console.log("attemping database connection...");
mongoClient.connect(async () => {
  console.log("connected to database.");
  await ensureIndexes();
  // await addDummyData();
  await readTokens();

  // const resources = await getDatabase().collection(RESOURCES_COLLECTION).find().toArray();
  // resources.forEach(async resource => {
  //   const reviews = await getDatabase().collection(REVIEWS_COLLECTION).find({resource: resource._id}).toArray();
  //   await getDatabase().collection(RESOURCES_COLLECTION).updateOne({_id: resource._id}, {$set: {reviewCount: reviews.length}})
  //   console.log("processed", resource.name)
  // })
  app.listen(5000, () => console.log("started marketplace backend."));
});

// const generateAndPutResource = async (
//   file: any,
//   resourceType: ResourceType,
//   randomCategory: Category
// ) => {
//   // console.log("resource")
//   const resource = {
//     name: (rword.generate(1) + "-" + resourceType.substring(0, 1)) as string,
//     price: 0,
//     rating: 0,
//     category: randomCategory!!._id,
//     thread: "lol xd",
//     owner: new ObjectId("5fe53ce6ffa79fc6331f8ab4"),
//     updated: new Date(),
//     downloads: Math.floor(Math.random() * 100000),
//     type: resourceType,
//   };
//   const result = await getDatabase()
//     .collection(RESOURCES_COLLECTION)
//     .insertOne(resource);
//     // console.log("starting version")
//   const resourceResult = result.ops[0];
//   const versions = []
//   for (let i = 0; i <= 15; i++) {
//     const version = {
//       version: (Math.random() * 10).toString(),
//       title: rword.generate(1) as string,
//       description: (rword.generate(5) as string[]).join(" "),
//       timestamp: new Date(
//         new Date().getTime() - Math.floor(Math.random() * 1000)
//       ),
//       resource: resourceResult._id,
//       author: new ObjectId("5fe53ce6ffa79fc6331f8ab4"),
//     };
//     versions.push(version)
//   }
//   await getDatabase().collection(VERSIONS_COLLECTION).insertMany(versions);
// };

// const addDummyData = async () => {
//   for (const resourceType of [
//     ResourceType.PLUGIN,
//   ]) {
//     const categories: Category[] = await getDatabase()
//       .collection(CATEGORIES_COLLECTION)
//       .find({ type: resourceType })
//       .toArray();
//     for (let i = 0; i < 10000; i++) {
//       const randomCategory =
//         categories[Math.floor(Math.random() * categories.length)];
//       generateAndPutResource(undefined, resourceType, randomCategory!!);
//     }
//   }
// };
