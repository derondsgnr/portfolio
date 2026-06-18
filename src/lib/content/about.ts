import type { AboutContent, AboutFilm, AboutSections } from "./defaults";
import { DEFAULT_ABOUT } from "./defaults";
import { readContentJson } from "./live-source";

export type { AboutContent, AboutFilm, AboutSections };

function str(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim() !== "" ? v : fallback;
}

function strList(v: unknown, fallback: string[]): string[] {
  if (!Array.isArray(v)) return fallback;
  const out = v.map((x) => String(x ?? "").trim()).filter(Boolean);
  return out.length ? out : fallback;
}

function films(v: unknown, fallback: AboutFilm[]): AboutFilm[] {
  if (!Array.isArray(v)) return fallback;
  const out: AboutFilm[] = [];
  for (const raw of v) {
    const f = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
    const title = String(f.title ?? "").trim();
    if (!title) continue;
    out.push({
      title,
      why: String(f.why ?? "").trim(),
      cover: typeof f.cover === "string" && f.cover.trim() ? f.cover.trim() : "",
    });
  }
  return out.length ? out : fallback;
}

function sections(v: unknown): AboutSections {
  const s = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  const d = DEFAULT_ABOUT.sections;
  const bool = (key: keyof AboutSections) => (typeof s[key] === "boolean" ? (s[key] as boolean) : d[key]);
  return {
    globe: bool("globe"),
    lives: bool("lives"),
    films: bool("films"),
    console: bool("console"),
    friendCat: bool("friendCat"),
    health: bool("health"),
  };
}

function normalize(raw: unknown): AboutContent {
  const a = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const d = DEFAULT_ABOUT;
  return {
    greeting: str(a.greeting, d.greeting),
    location: str(a.location, d.location),
    hook: str(a.hook, d.hook),
    intro: strList(a.intro, d.intro),
    livesIntro: str(a.livesIntro, d.livesIntro),
    lives: strList(a.lives, d.lives),
    comics: str(a.comics, d.comics),
    missionIntro: str(a.missionIntro, d.missionIntro),
    peak: str(a.peak, d.peak),
    dara: str(a.dara, d.dara),
    daraTag: str(a.daraTag, d.daraTag),
    midShow: str(a.midShow, d.midShow),
    films: films(a.films, d.films),
    genres: strList(a.genres, d.genres),
    consoleHeading: str(a.consoleHeading, d.consoleHeading),
    consoleBody: str(a.consoleBody, d.consoleBody),
    games: strList(a.games, d.games),
    friendCat: str(a.friendCat, d.friendCat),
    health: str(a.health, d.health),
    signoff: str(a.signoff, d.signoff),
    sections: sections(a.sections),
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const parsed = await readContentJson<unknown>("about.json");
    return normalize(parsed);
  } catch {
    return DEFAULT_ABOUT;
  }
}
