import express from "express";

export async function getClan(tag: string) {
  const response = await fetch(`${process.env.CLASH_API_BASE_URL}clans/${encodeURIComponent(tag)}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Não foi possível consultar o clã na API do Clash of Clans.");
  }

  const clan = await response.json();

  return clan;
}
