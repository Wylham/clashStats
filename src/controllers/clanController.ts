import type { Request, Response } from "express";
import { getClanByTag } from "../services/clanService";

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
