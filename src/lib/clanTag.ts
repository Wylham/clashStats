const CLAN_TAG_REGEX = /^#[0289PYLQGRJCUV]{3,9}$/;

export function normalizeClanTag(tag: string) {
  return tag.trim().toUpperCase();
}

export function isValidClanTag(tag: string) {
  return CLAN_TAG_REGEX.test(normalizeClanTag(tag));
}
