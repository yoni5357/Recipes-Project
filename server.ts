import express, { NextFunction, Request, Response } from "express";
import recipesRouter from "./routes/recipesRouter";
import { BaseError } from "./errors";
import morgan from "morgan";
import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

const server = express();
const port = 3030;
const logFormat = ':date[iso] :method :status';
const sequelize = new Sequelize(process.env.DB_CONNECTION);

server.use(express.json());
server.use(morgan(logFormat));

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
  }
}

server.use("/api/recipes",recipesRouter);

server.listen(port, async () => {
    console.log("Server listening on port ", port);
    await testConnection();
})


server.use((err:BaseError, req:Request, res:Response, next:NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Server Error",
    statusCode:err.status
  });
});