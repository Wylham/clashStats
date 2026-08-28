import express from "express";
import { type Request, type Response, type NextFunction } from "express";
import { string } from "zod";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api Rodando Tranquilamente...");
});

app.post("/clan", (req, res) => {
  const body = req.body;
  const clanTagRegex = /^#[0289PYLQGRJCUV]{3,9}$/;

  if (!body.tag || typeof body.tag !== "string" || !body.tag.trim() || !clanTagRegex.test(body.tag)) {
    return res.status(400).json({
      error: "Clã sem tag! Por favor insira a tag do clã.",
    });
  }

  if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
    return res.status(400).json({
      error: "Clã sem nome! Por favor insira o nome do clã",
    });
  }
  console.log(body);
  res.json(body);
});

app.get("/player", (req, res) => {
  res.json({
    message: "Caminho para os players futuramente",
    status: "ok",
  });
});

export default app;
