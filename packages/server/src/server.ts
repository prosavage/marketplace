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
  ["hehexddd", new ObjectId("5ff5018f90a7f7554427af6d")],
]);

export const bunny = new BunnyCDNStorage();

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(morgan("tiny"));
app.use(betterResponse);
app.use("/auth", authRouter);
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
  app.listen(5000, () => console.log("started marketplace backend."));
});

// const addDummyData = async () => {
//   for (let i = 0; i < 10000; i++) {
//     const resource = {
//       name: ("software-" + rword.generate(1)) as string,
//       price: 0,
//       rating: 0,
//       category: new ObjectId("5ff5ec3126a59d56d809e6c4"),
//       thread: "lol xd",
//       owner: new ObjectId("5ff5018f90a7f7554427af6d"),
//       updated: new Date(),
//       downloads: Math.floor(Math.random() * 100000),
//       type: ResourceType.SOFTWARE,
//     };
//     getDatabase().collection(RESOURCES_COLLECTION).insertOne(resource);
//   }
// };
