import { useEffect, useState } from "react";
import type { Spielstand, SegmentKey } from "../types";
import { BASIS_SEGMENTE } from "../config/segmente";

const KEY = "wurmkrieg2.spielstand.v1";

export function startSpielstand(): Spielstand {
  const segmentStufen: Partial<Record<SegmentKey, number>> = {};
  for (const k of BASIS_SEGMENTE) segmentStufen[k] = 1;
  return {
    name: "Spieler",
    apfel: 30,
    sternanis: 0,
    level: 1,
    hoechstesLevel: 1,
    siege: 0,
    niederlagen: 0,
    segmentStufen,
    spezial: { eichhoernchen: 1, taube: 0, schildkroete: 0 },
    loadout: ["beine", "mg", "panzer"],
    admin: { schildkroeteSpeed: 0.6, taubeMineDichte: 3, taubeMineDauer: 6 },
  };
}

function laden(): Spielstand {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return startSpielstand();
    return { ...startSpielstand(), ...(JSON.parse(raw) as Spielstand) };
  } catch {
    return startSpielstand();
  }
}

export function useSpielstand() {
  const [stand, setStand] = useState<Spielstand>(() => laden());
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(stand));
    } catch {
      /* ignore */
    }
  }, [stand]);
  return [stand, setStand] as const;
}

export function resetSpielstand(): Spielstand {
  const s = startSpielstand();
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
  return s;
}
