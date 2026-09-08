import express from "express";
import { type Request, type Response, type NextFunction } from "express";
import { json, string } from "zod";
import "dotenv/config";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api Rodando Tranquilamente...");
});

app.post("/clan", async (req, res) => {
  const body = req.body;
  const clanTagRegex = /^#[0289PYLQGRJCUV]{3,9}$/;

  const allowedFields = ["tag", "name"];
  const receivedFields = Object.keys(body);
  const requiredFields = ["tag", "name"];

  const hasUnknownFields = receivedFields.some((field) => !allowedFields.includes(field));
  const hasMissingFields = requiredFields.some((field) => !receivedFields.includes(field));

  if (hasMissingFields) {
    return res.status(400).json({
      error: "A requisição contém campos obrigatórios ausentes.",
    });
  }

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

  const response = await fetch(`${process.env.CLASH_API_BASE_URL}clans/${encodeURIComponent(body.tag)}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    return res.status(response.status).json({
      error: "Não foi possível consultar o clã na API do Clash of Clans.",
    });
  }

  const clan = await response.json();

  res.json(clan);
});

app.get("/player", (req, res) => {
  res.json({
    message: "Caminho para os players futuramente",
    status: "ok",
  });
});

export default app;
