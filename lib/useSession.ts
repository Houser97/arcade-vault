"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Session } from "./games";

const SESSION_KEY = "av_user";
const SESSION_EVENT = "av-session-change";

function readSession(): Session {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(SESSION_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SESSION_EVENT, onChange);
  };
}

function getServerSnapshot(): Session {
  return null;
}

export function useSession() {
  const session = useSyncExternalStore(subscribe, readSession, getServerSnapshot);

  const signIn = useCallback((name: string) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name }));
    window.dispatchEvent(new Event(SESSION_EVENT));
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event(SESSION_EVENT));
  }, []);

  return { session, signIn, signOut };
}
