import express, { Request, Response } from "express";
import morgan from "morgan";
import mongodb, { ObjectId } from "mongodb";
import dotenv from "dotenv"
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

dotenv.config();

const mongoClient = new mongodb.MongoClient(process.env.MONGODB_URL || "mongodb://localhost:27017", { useUnifiedTopology: true });
export const getDatabase = () => {
    return mongoClient.db(process.env.MONGODB_DB_NAME || "marketplace")
}
export const tokenMap = new Map<string, User["_id"]>([
    // temp perma token for dev
    ["hehexddd", new ObjectId("5fe53ce6ffa79fc6331f8ab4")]
]);

export const bunny = new BunnyCDNStorage();

const app = express();
app.use(fileUpload());
app.use(express.json())
app.use(morgan("tiny"));
app.use(betterResponse)
app.use("/auth", authRouter);
app.use("/resources", resourceRouter);
app.use("/categories", categoryRouter);
app.use("/directory", directoryRouter);
app.use("/version", versionRouter);
app.use("/review", reviewRouter);

app.get("/", (_req: Request, res: Response) => {
    res.success({ hello: "there!" })
});

mongoClient.connect(async () => {
    console.log("connected to database.")
    await ensureIndexes();
    app.listen(5000, () => console.log("started marketplace backend."));
})

