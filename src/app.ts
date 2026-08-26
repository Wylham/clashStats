import express from "express";
import { type Request, type Response, type NextFunction } from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Api Rodando Tranquilamente...");
});

app.post("/clan", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

app.get("/player", (req, res) => {
  res.json({
    message: "Caminho para os players futuramente",
    status: "ok",
  });
});

app.use(express.json());

export default app;
