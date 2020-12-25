import express from "express";
import directoryResourceRouter from "./DirectoryResourceRouter";

const directoryRouter = express.Router();

directoryRouter.use("/resources", directoryResourceRouter)

export default directoryRouter;