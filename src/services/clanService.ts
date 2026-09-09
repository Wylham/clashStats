import express from "express";
import { prisma } from "../lib/prisma";
import { ClanType, WarFrequency } from "../generated/prisma/client";

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
  console.log(clan);

  return clan;
}

export async function saveClan(clan: any) {
  return await prisma.clan.create({
    data: {
      tag: clan.tag,
      name: clan.name,
      description: clan.description,

      requiredTownhallLevel: clan.requiredTownhallLevel,

      warFrequency: WarFrequency.ALWAYS,
      clanLevel: clan.clanLevel,
      warWinStreak: clan.warWinStreak,
      warWins: clan.warWins,
      warTies: clan.warTies,
      warLosses: clan.warLosses,

      clanPoints: clan.clanPoints,
      clanBuilderBasePoints: clan.clanBuilderBasePoints,
      clanCapitalPoints: clan.clanCapitalPoints,

      isFamilyFriendly: clan.isFamilyFriendly,

      requiredTrophies: clan.requiredTrophies,
      requiredBuilderBaseTrophies: clan.requiredBuilderBaseTrophies,

      isWarLogPublic: clan.isWarLogPublic,

      type: ClanType.INVITE_ONLY,

      members: clan.members,

      warLeagueId: clan.warLeague?.id,
      warLeagueName: clan.warLeague?.name,

      capitalLeagueId: clan.capitalLeague?.id,
      capitalLeagueName: clan.capitalLeague?.name,

      chatLanguageId: clan.chatLanguage?.id,
      chatLanguageName: clan.chatLanguage?.name,

      locationId: clan.location?.id,
      locationName: clan.location?.name,
      locationIsCountry: clan.location?.isCountry,
      locationCountryCode: clan.location?.countryCode,

      badgeSmallUrl: clan.badgeUrls?.small,
      badgeMediumUrl: clan.badgeUrls?.medium,
      badgeLargeUrl: clan.badgeUrls?.large,
    },
  });
}
