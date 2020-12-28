import express from "express";
import directoryResourceRouter from "./DirectoryResourceRouter";
import directoryVersionRouter from "./DirectoryVersionRouter";

const directoryRouter = express.Router();

directoryRouter.use("/resources", directoryResourceRouter)
directoryRouter.use("/versions", directoryVersionRouter)

export default directoryRouter;