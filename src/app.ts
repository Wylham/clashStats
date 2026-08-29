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

  const aloowedFields = ["tag", "name"];
  const receivedFields = Object.keys(body);

  const hasUnknownFields = receivedFields.some((field) => !aloowedFields.includes(field));

  if (hasUnknownFields) {
    return res.status(400).json({
      error: "A requisição contém campos não permitidos.",
    });
  }

  if (!body.tag) {
    return res.status(400).json({
      error: "Clã sem tag! Por favor insira a tag do clã.",
    });
  }

  if (typeof body.tag !== "string" || !clanTagRegex.test(body.tag)) {
    return res.status(400).json({
      error: "Tag inválida! Por favor insira uma tag válida.",
    });
  }

  if (!body.name) {
    return res.status(400).json({
      error: "Clã sem nome! Por favor insira o nome do clã.",
    });
  }

  if (typeof body.name !== "string" || !body.name.trim()) {
    return res.status(400).json({
      error: "Nome de clã inválido.",
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
