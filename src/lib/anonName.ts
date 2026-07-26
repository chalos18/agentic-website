'use client';

// Nobody logs in to comment or submit a recipe request. Instead each visitor
// gets a silly, stable, cooking-themed name derived from a random id we keep
// in a cookie — same person keeps the same name across visits, nobody has to
// register, and 26 x 30 = 780 combinations is far more headroom than the
// handful of regulars this site expects.
const COOKIE_NAME = 'anon_id';

const ADJECTIVES = [
  'Saucy', 'Toasted', 'Zesty', 'Braised', 'Caramelized', 'Whisked', 'Simmering',
  'Buttery', 'Crispy', 'Glazed', 'Pickled', 'Roasted', 'Smoky', 'Spiced',
  'Fermented', 'Flaky', 'Charred', 'Candied', 'Peckish', 'Sizzling', 'Marinated',
  'Frosted', 'Doughy', 'Umami', 'Garlicky', 'Herby',
];

const NOUNS = [
  'Whisk', 'Spatula', 'Skillet', 'Ladle', 'Tureen', 'Colander', 'Rolling Pin',
  'Dutch Oven', 'Zester', 'Peppercorn', 'Sourdough', 'Truffle', 'Casserole',
  'Cast Iron', 'Mandoline', 'Pantry Moth', 'Sous Chef', 'Stock Pot', 'Waffle Iron',
  'Butter Dish', 'Grater', 'Tea Towel', 'Mortar', 'Pestle', 'Bundt Pan', 'Trivet',
  'Cutting Board', 'Wooden Spoon', 'Apron', 'Oven Mitt',
];

function randomId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function hashToIndex(id: string, mod: number): number {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % mod;
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string): void {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${oneYear}; SameSite=Lax`;
}

/** Returns a stable cooking-themed display name for the current browser, minting one on first call. */
export function getAnonName(): string {
  let id = readCookie(COOKIE_NAME);
  if (!id) {
    id = randomId();
    writeCookie(COOKIE_NAME, id);
  }
  const adjective = ADJECTIVES[hashToIndex(id, ADJECTIVES.length)];
  const noun = NOUNS[hashToIndex(id + 'noun', NOUNS.length)];
  return `${adjective} ${noun}`;
}
