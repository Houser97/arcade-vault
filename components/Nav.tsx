"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/lib/useSession";

const LINKS = [
  { href: "/", label: "Library", match: (p: string) => p === "/" || p.startsWith("/games") },
  { href: "/leaderboard", label: "Hall of Fame", match: (p: string) => p.startsWith("/leaderboard") },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { session, signOut } = useSession();

  const close = () => setOpen(false);

  return (
    <>
      <nav className="av-nav">
        <Link href="/" className="logo" onClick={close}>
          <div className="logo-mark" />
          <div className="logo-text neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </div>
        </Link>
        <div className="links">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={link.match(pathname) ? "active" : ""}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="spacer" />
        <div className="coin-counter">
          <span className="coin" />
          <span>CREDITS · 03</span>
        </div>
        {session ? (
          <button className="btn ghost auth-btn" onClick={signOut}>
            {session.name} ▾
          </button>
        ) : (
          <Link href="/login" className="btn auth-btn">
            Sign In
          </Link>
        )}
        <button className="btn ghost hamburger" onClick={() => setOpen(true)} aria-label="Menu">
          ≡
        </button>
      </nav>

      <button className={`av-mobile-backdrop${open ? " open" : ""}`} onClick={close} />
      <aside className={`av-mobile-panel${open ? " open" : ""}`}>
        <div className="pixel neon-cyan" style={{ fontSize: 11, marginBottom: 16 }}>
          MENU
        </div>
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={link.match(pathname) ? "active" : ""}
            onClick={close}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/login" className={pathname === "/login" ? "active" : ""} onClick={close}>
          {session ? "Account" : "Sign In"}
        </Link>
        <div style={{ flex: 1 }} />
        <div className="pixel" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.16em" }}>
          CREDITS · 03
        </div>
      </aside>
    </>
  );
}
