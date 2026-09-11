import type { Request, Response } from "express";
import { getClan, saveClan, getClanByTag } from "../services/clanService";

export async function getClanController(req: Request, res: Response) {
  const { tag } = req.params;

  if (!tag || Array.isArray(tag)) {
    return res.status(400).json({
      error: "A tag do clã é obrigatória.",
    });
  }

  const clan = await getClanByTag(tag);

  if (!clan) {
    return res.status(404).json({
      error: "Clã não encontrado.",
    });
  }

  return res.status(200).json(clan);
}

export async function createClanController(req: Request, res: Response) {
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

  try {
    const clan = await getClan(body.tag);
    const savedClan = await saveClan(clan);

    return res.status(200).json(savedClan);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao consultar a API do Clash of Clans.",
    });
  }
}
