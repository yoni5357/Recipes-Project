import express, { NextFunction, Request, Response } from "express";
import recipesRouter from "./routes/recipesRouter";
import { BaseError } from "./errors";
import morgan from "morgan";

const server = express();
const port = 3030;
const logFormat = ':date[iso] :method :status';

server.use(express.json());
server.use(morgan(logFormat));

server.use("/api/recipes",recipesRouter);

server.listen(port, () => {
    console.log("Server listening on port ", port);
})


server.use((err:BaseError, req:Request, res:Response, next:NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Server Error",
    statusCode:err.status
  });
});