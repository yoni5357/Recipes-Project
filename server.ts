import express from "express";
import recipesRouter from "./routes/recipesRouter";

const server = express();
const port = 3030;

server.use(express.json());

server.use("/api/recipes",recipesRouter);

server.listen(port, () => {
    console.log("Server listening on port ", port);
})