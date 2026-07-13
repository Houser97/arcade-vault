"use client";

import { useMemo, useState } from "react";
import GameCard from "@/components/GameCard";
import { CATS, GAMES, type GameCategory } from "@/lib/games";

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"ALL" | GameCategory>("ALL");

  const filtered = useMemo(() => {
    return GAMES.filter(
      (game) =>
        (category === "ALL" || game.cat === category) &&
        game.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, category]);

  return (
    <div className="fade-in">
      <section className="av-hero">
        <h1 className="flicker">ARCADE VAULT</h1>
        <div className="sub">
          INSERT COIN TO PLAY <span className="blink">_</span>
        </div>
      </section>

      <div className="av-filters">
        <div className="av-search">
          <span className="ico">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a game by name…"
          />
        </div>
        <div className="av-chips">
          {CATS.map((c) => (
            <button
              key={c}
              className={`chip${category === c ? " active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="av-grid">
        {filtered.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 80, color: "var(--ink-faint)" }}>
            <div className="pixel" style={{ fontSize: 14, color: "var(--magenta)", marginBottom: 12 }}>
              NO RESULTS FOUND
            </div>
            <div>Try another search or category.</div>
          </div>
        )}
      </div>
    </div>
  );
}
