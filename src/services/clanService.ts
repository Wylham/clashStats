import { prisma } from "../lib/prisma";
import { ClanType, WarFrequency } from "../generated/prisma/client";
import { getCachedJson, getClanCacheKey, setCachedJson } from "../lib/redis.js";

export type ClashClan = {
  tag: string;
  name: string;
  description?: string;
  requiredTownhallLevel: number;
  warFrequency: string;
  clanLevel: number;
  warWinStreak: number;
  warWins: number;
  warTies?: number;
  warLosses?: number;
  clanPoints: number;
  clanBuilderBasePoints: number;
  clanCapitalPoints: number;
  isFamilyFriendly: boolean;
  requiredTrophies: number;
  requiredBuilderBaseTrophies: number;
  isWarLogPublic: boolean;
  type: string;
  members: number;
  warLeague?: { id: number; name: string };
  capitalLeague?: { id: number; name: string };
  chatLanguage?: { id: number; name: string };
  location?: {
    id: number;
    name: string;
    isCountry: boolean;
    countryCode?: string;
  };
  badgeUrls?: { small: string; medium: string; large: string };
};

export async function getClan(tag: string): Promise<ClashClan> {
  const cacheKey = getClanCacheKey(tag);
  const cachedClan = await getCachedJson<ClashClan>(cacheKey);

  if (cachedClan) {
    console.log("CACHE HIT", cacheKey);
    return cachedClan;
  }

  console.log("CACHE MISS", cacheKey);
  const response = await fetch(`${process.env.CLASH_API_BASE_URL}clans/${encodeURIComponent(tag)}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Não foi possível consultar o clã na API do Clash of Clans.");
  }

  const clan = (await response.json()) as ClashClan;

  await setCachedJson(cacheKey, clan);

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

export async function saveClan(clan: ClashClan) {
  const warFrequency = warFrequencyMap[clan.warFrequency];
  const clanType = clanTypeMap[clan.type];

  if (!warFrequency || !clanType) {
    throw new Error("Valor de enum inválido recebido da API do Clash of Clans.");
  }

  const data = {
    tag: clan.tag,
    name: clan.name,
    description: clan.description ?? null,

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

    warLeagueId: clan.warLeague?.id ?? null,
    warLeagueName: clan.warLeague?.name ?? null,

    capitalLeagueId: clan.capitalLeague?.id ?? null,
    capitalLeagueName: clan.capitalLeague?.name ?? null,

    chatLanguageId: clan.chatLanguage?.id ?? null,
    chatLanguageName: clan.chatLanguage?.name ?? null,

    locationId: clan.location?.id ?? null,
    locationName: clan.location?.name ?? null,
    locationIsCountry: clan.location?.isCountry ?? null,
    locationCountryCode: clan.location?.countryCode ?? null,

    badgeSmallUrl: clan.badgeUrls?.small ?? null,
    badgeMediumUrl: clan.badgeUrls?.medium ?? null,
    badgeLargeUrl: clan.badgeUrls?.large ?? null,
  };

  return await prisma.clan.upsert({
    where: {
      tag: clan.tag,
    },
    create: data,
    update: data,
  });
}

export async function getClanByTag(tag: string) {
  return await prisma.clan.findUnique({
    where: {
      tag,
    },
  });
}
