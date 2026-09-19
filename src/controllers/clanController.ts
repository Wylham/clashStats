import type { Request, Response } from "express";
import { getClan, getClanMembers, saveClan } from "../services/clanService";
import { isValidClanTag } from "../lib/clanTag";

function getTagFromParams(req: Request, res: Response) {
  const { tag } = req.params;

  if (!tag || Array.isArray(tag)) {
    res.status(400).json({
      error: "A tag do clã é obrigatória.",
    });
    return null;
  }

  if (!isValidClanTag(tag)) {
    res.status(400).json({
      error: "Tag inválida! Por favor insira uma tag válida.",
    });
    return null;
  }

  return tag;
}

export async function getClanController(req: Request, res: Response) {
  const tag = getTagFromParams(req, res);

  if (!tag) return;

  try {
    const clan = await getClan(tag);

    return res.status(200).json(clan);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Não foi possível consultar o clã.",
    });
  }
}

export async function getClanMembersController(req: Request, res: Response) {
  const tag = getTagFromParams(req, res);

  if (!tag) return;

  try {
    const members = await getClanMembers(tag);

    return res.status(200).json(members);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Não foi possível consultar os membros do clã.",
    });
  }
}

export async function createClanController(req: Request, res: Response) {
  const body = req.body;
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

  if (typeof body.tag !== "string" || !isValidClanTag(body.tag)) {
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
      error: "Não foi possível processar o clã.",
    });
  }
}
