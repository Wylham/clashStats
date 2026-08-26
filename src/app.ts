import express from "express";
import { type Request, type Response, type NextFunction } from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Api Rodando Tranquilamente...");
});

app.get("/clan", (req, res) => {
  res.json({
    message: "Caminho para os clãs futuramente",
    status: "ok",
  });
});

app.get("/player", (req, res) => {
  res.json({
    message: "Caminho para os players futuramente",
    status: "ok",
  });
});

app.use(express.json());

export default app;
