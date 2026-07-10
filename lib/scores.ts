import type { SavedScoreEntry } from "./games";

const SCORES_KEY = "av_scores";

export function readSavedScores(): SavedScoreEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(SCORES_KEY) ?? "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function saveScoreEntry(entry: Omit<SavedScoreEntry, "at">) {
  const all = readSavedScores();
  all.push({ ...entry, at: Date.now() });
  localStorage.setItem(SCORES_KEY, JSON.stringify(all));
}
