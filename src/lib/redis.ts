import "dotenv/config";
import { createClient } from "redis";

const DEFAULT_CACHE_TTL_SECONDS = 300;
const redisUrl = process.env.REDIS_URL;

const redis = redisUrl
  ? createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: false,
      },
    })
  : null;

let connectPromise: Promise<boolean> | null = null;

redis?.on("error", () => undefined);

function getCacheTtlSeconds() {
  const configuredTtl = Number.parseInt(process.env.CLAN_CACHE_TTL ?? "", 10);

  return Number.isFinite(configuredTtl) && configuredTtl > 0 ? configuredTtl : DEFAULT_CACHE_TTL_SECONDS;
}

async function ensureRedisConnection() {
  if (!redis) {
    return false;
  }

  if (redis.isReady) {
    return true;
  }

  connectPromise ??= redis
    .connect()
    .then(() => true)
    .catch((error) => {
      connectPromise = null;
      console.warn("CACHE ERROR: Redis indisponível.", error);
      return false;
    });

  return await connectPromise;
}

export function getClanCacheKey(tag: string) {
  const normalizedTag = tag.trim().toUpperCase();

  return `clan:${normalizedTag}`;
}

export function getClanMembersCacheKey(tag: string) {
  return `${getClanCacheKey(tag)}:members`;
}

export async function getCachedJson<T>(key: string): Promise<T | null> {
  try {
    if (!(await ensureRedisConnection())) {
      return null;
    }

    const cachedValue = await redis!.get(key);

    return cachedValue ? (JSON.parse(cachedValue) as T) : null;
  } catch (error) {
    console.warn("CACHE ERROR: não foi possível ler do Redis.", error);
    return null;
  }
}

export async function setCachedJson(key: string, value: unknown) {
  try {
    if (!(await ensureRedisConnection())) {
      return;
    }

    await redis!.setEx(key, getCacheTtlSeconds(), JSON.stringify(value));
  } catch (error) {
    console.warn("CACHE ERROR: não foi possível gravar no Redis.", error);
  }
}
