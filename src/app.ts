import express from "express";
import { type Request, type Response, type NextFunction } from "express";

const app = express();
app.use(express.json());

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

export default app;
