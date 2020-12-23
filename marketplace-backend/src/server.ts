import express, {Request, Response} from "express";
import morgan from "morgan";
import mongodb, { ObjectId } from "mongodb";
import dotenv from "dotenv"
import { User } from "./types/User";
import authRouter from "./routes/AuthRouter";
import resourceRouter from "./routes/ResourceRouter";
import categoryRouter from "./routes/CategoryRouter";
import directoryRouter from "./routes/DirectoryRouter";
import { RESOURCES_COLLECTION } from "./constants";
import { Resource, ResourceType } from "./types/Resource";
import {rword} from "rword";
dotenv.config();

const mongoClient = new mongodb.MongoClient(process.env.MONGODB_URL || "mongodb://localhost:27017", {useUnifiedTopology: true});
export const getDatabase = () => {
    return mongoClient.db(process.env.MONGODB_DB_NAME || "marketplace")
}
export const tokenMap = new Map<string, User["_id"]>();

const app = express();
app.use(express.json())
app.use(morgan("tiny"));
app.use("/auth", authRouter);
app.use("/resources", resourceRouter);
app.use("/categories", categoryRouter);
app.use("/directory", directoryRouter);

app.get("/", (req: Request, res: Response) => {
    res.json({dab: "dab"})
});

declare module 'express' {
    interface Request {
        user?: User;
    }
}

mongoClient.connect((err) => {
    console.log("connected to database.")
    app.listen(5000, () => console.log("started marketplace backend."))
})