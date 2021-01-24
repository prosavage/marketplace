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
import ensureIndexes from "./database";
import reviewRouter from "./routes/ReviewRouter";
import { BunnyCDNStorage } from "./bunnycdn";
import fileUpload from "express-fileupload";
import cors from "cors";
import userIconRouter from "./routes/UserRouter";
import { RESOURCES_COLLECTION } from "./constants";

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
  ["hehexddd", new ObjectId("5ff5018f90a7f7554427af6d")]
]);

export const bunny = new BunnyCDNStorage();

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(morgan("tiny"));
app.use(betterResponse);
app.use("/auth", authRouter);
app.use("/users/icon", userIconRouter)
app.use("/resources", resourceRouter);
app.use("/categories", categoryRouter);
app.use("/directory", directoryRouter);
app.use("/version", versionRouter);
app.use("/review", reviewRouter);

app.get("/", (_req: Request, res: Response) => {
  res.success({ hello: "there!" });
});

mongoClient.connect(async () => {
  console.log("connected to database.");
  await ensureIndexes();
  // await addDummyData();
  app.listen(5000, () => console.log("started marketplace backend."));
});

// const generateAndPutResource = async (
//   file: any,
//   resourceType: ResourceType,
//   randomCategory: Category
// ) => {
//   const resource = {
//     name: (rword.generate(1) + "-" + resourceType.substring(0, 1)) as string,
//     price: 0,
//     rating: 0,
//     category: randomCategory!!._id,
//     thread: "lol xd",
//     owner: new ObjectId("5ff5018f90a7f7554427af6d"),
//     updated: new Date(),
//     downloads: Math.floor(Math.random() * 100000),
//     type: resourceType,
//   };
//   const result = await getDatabase()
//     .collection(RESOURCES_COLLECTION)
//     .insertOne(resource);
//   const resourceResult = result.ops[0];
//   const version = {
//     version: (Math.random() * 10).toString(),
//     title: rword.generate(1) as string,
//     description: (rword.generate(5) as string[]).join(" "),
//     timestamp: new Date(
//       new Date().getTime() - Math.floor(Math.random() * 1000)
//     ),
//     resource: resourceResult._id,
//     author: new ObjectId("5ff5018f90a7f7554427af6d"),
//   };
//   await getDatabase().collection(VERSIONS_COLLECTION).insertOne(version);
// };

// const addDummyData = async () => {
//   const file = readFileSync(
//     "C:\\Users\\prosavage\\Documents\\Projects\\marketplace\\packages\\server\\FactionsX-lib.jar"
//   );
//   for (const resourceType of [
//     ResourceType.MOD,
//     ResourceType.PLUGIN,
//     ResourceType.SOFTWARE,
//   ]) {
//     const categories: Category[] = await getDatabase()
//       .collection(CATEGORIES_COLLECTION)
//       .find({ type: resourceType })
//       .toArray();
//     for (let i = 0; i < 10000; i++) {
//       const randomCategory =
//         categories[Math.floor(Math.random() * categories.length)];
//       generateAndPutResource(file, resourceType, randomCategory!!);
//     }
//   }
// };
