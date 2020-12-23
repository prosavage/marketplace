import express, { Request, Response } from "express";
import morgan from "morgan";
import mongodb from "mongodb";
import dotenv from "dotenv"
import { User } from "./types/User";
import authRouter from "./routes/AuthRouter";
import resourceRouter from "./routes/ResourceRouter";
import categoryRouter from "./routes/CategoryRouter";
import directoryRouter from "./routes/DirectoryRouter";
import versionRouter from "./routes/VersionRouter";
import betterResponse from "./middleware/ResponseFunctions";
dotenv.config();

const mongoClient = new mongodb.MongoClient(process.env.MONGODB_URL || "mongodb://localhost:27017", { useUnifiedTopology: true });
export const getDatabase = () => {
    return mongoClient.db(process.env.MONGODB_DB_NAME || "marketplace")
}
export const tokenMap = new Map<string, User["_id"]>();

const app = express();
app.use(express.json())
app.use(morgan("tiny"));
app.use(betterResponse)
app.use("/auth", authRouter);
app.use("/resources", resourceRouter);
app.use("/categories", categoryRouter);
app.use("/directory", directoryRouter);
app.use("/version", versionRouter);

app.get("/", (_req: Request, res: Response) => {
    res.success({ dab: "dab" })
});

mongoClient.connect(() => {
    console.log("connected to database.")
    app.listen(5000, () => console.log("started marketplace backend."))
})