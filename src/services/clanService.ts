import { prisma } from "../lib/prisma";
import { ClanType, WarFrequency } from "../generated/prisma/client";
import { getCachedJson, getClanCacheKey, getClanMembersCacheKey, setCachedJson } from "../lib/redis.js";
import { normalizeClanTag } from "../lib/clanTag";

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

export type ClashClanMember = {
  tag: string;
  name: string;
  role: string;
  expLevel: number;
  trophies: number;
  clanRank: number;
  previousClanRank: number;
  donations: number;
  donationsReceived: number;
  clanChestPoints?: number;
};

export type ClashClanMembersResponse = {
  items: ClashClanMember[];
};

async function fetchClash<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${process.env.CLASH_API_BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`,
      },
    });
  } catch (error) {
    console.error("CLASH API ERROR: não foi possível alcançar a API do Clash.", error);
    throw error;
  }

  if (!response.ok) {
    console.error(`CLASH API ERROR: resposta HTTP ${response.status}.`);
    throw new Error("Não foi possível consultar a API do Clash of Clans.");
  }

  return (await response.json()) as T;
}

export async function getClan(tag: string): Promise<ClashClan> {
  const normalizedTag = normalizeClanTag(tag);
  const cacheKey = getClanCacheKey(normalizedTag);
  const cachedClan = await getCachedJson<ClashClan>(cacheKey);

  if (cachedClan) {
    console.log("CACHE HIT", cacheKey);
    return cachedClan;
  }

  console.log("CACHE MISS", cacheKey);
  const clan = await fetchClash<ClashClan>(`clans/${encodeURIComponent(normalizedTag)}`);

  await setCachedJson(cacheKey, clan);

  return clan;
}

export async function getClanMembers(tag: string): Promise<ClashClanMembersResponse> {
  const normalizedTag = normalizeClanTag(tag);
  const cacheKey = getClanMembersCacheKey(normalizedTag);
  const cachedMembers = await getCachedJson<ClashClanMembersResponse>(cacheKey);

  if (cachedMembers) {
    console.log("CACHE HIT", cacheKey);
    return cachedMembers;
  }

  console.log("CACHE MISS", cacheKey);
  const members = await fetchClash<ClashClanMembersResponse>(`clans/${encodeURIComponent(normalizedTag)}/members`);

  await setCachedJson(cacheKey, members);

  return members;
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
