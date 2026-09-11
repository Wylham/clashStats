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

  return clan;
}

const clanTypeMap: Record<string, ClanType> = {
  open: ClanType.OPEN,
  inviteOnly: ClanType.INVITE_ONLY,
  closed: ClanType.CLOSED,
};

const warFrequencyMap: Record<string, WarFrequency> = {
  unknown: WarFrequency.UNKNOWN,
  always: WarFrequency.ALWAYS,
  moreThanOncePerWeek: WarFrequency.MORE_THAN_ONCE_PER_WEEK,
  oncePerWeek: WarFrequency.ONCE_PER_WEEK,
  lessThanOncePerWeek: WarFrequency.LESS_THAN_ONCE_PER_WEEK,
  never: WarFrequency.NEVER,
  any: WarFrequency.ANY,
};

export async function saveClan(clan: any) {
  const warFrequency = warFrequencyMap[clan.warFrequency];
  const clanType = clanTypeMap[clan.type];

  if (!warFrequency || !clanType) {
    throw new Error("Valor de enum inválido recebido da API do Clash of Clans.");
  }
  return await prisma.clan.create({
    data: {
      tag: clan.tag,
      name: clan.name,
      description: clan.description,

      requiredTownhallLevel: clan.requiredTownhallLevel,

      warFrequency,
      clanLevel: clan.clanLevel,
      warWinStreak: clan.warWinStreak,
      warWins: clan.warWins,
      warTies: clan.warTies ?? null,
      warLosses: clan.warLosses ?? null,

      clanPoints: clan.clanPoints,
      clanBuilderBasePoints: clan.clanBuilderBasePoints,
      clanCapitalPoints: clan.clanCapitalPoints,

      isFamilyFriendly: clan.isFamilyFriendly,

      requiredTrophies: clan.requiredTrophies,
      requiredBuilderBaseTrophies: clan.requiredBuilderBaseTrophies,

      isWarLogPublic: clan.isWarLogPublic,

      type: clanType,

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
