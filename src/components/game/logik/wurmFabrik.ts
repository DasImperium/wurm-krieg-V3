import type { SegmentKey, Spielstand, Wurm } from "../types";
import { SEGMENTE } from "../config/segmente";
import { naechsteWurmId, neueSegmentInstanz } from "../utils/wurmBerechnung";

export function baueWurm(
  seite: "spieler" | "feind",
  segmentKeys: SegmentKey[],
  stand: Spielstand,
  startPos: number,
  pfad: number,
  kiStufe?: number,
): Wurm {
  let kettenhemd = 0;
  const segmente = segmentKeys.map((k) => {
    const stufe =
      seite === "spieler"
        ? Math.max(1, stand.segmentStufen[k] ?? 1)
        : Math.max(1, kiStufe ?? 1);
    if (k === "kettenhemd") kettenhemd += 0.08 + stufe * 0.04;
    return neueSegmentInstanz(k, stufe);
  });
  return {
    id: naechsteWurmId(),
    seite,
    pos: startPos,
    pfad,
    segmente,
    lebend: true,
    sterbend: false,
    flashBis: 0,
    langsamBis: 0,
    langsamFaktor: 1,
    letzterSchuss: {},
    kettenhemdReduktion: Math.min(0.6, kettenhemd),
  };
}

/** Baut einen zufälligen KI-Wurm aus dem KI-Pool. */
export function kiZufallswurm(
  pool: SegmentKey[],
  kiStufe: number,
  stand: Spielstand,
  startPos: number,
  pfad: number,
): Wurm {
  const anzahl = 2 + Math.floor(Math.random() * 5); // 2..6
  const teile: SegmentKey[] = [];
  // Mindestens einmal Beine, danach zufällig aus Pool
  if (pool.includes("beine")) teile.push("beine");
  while (teile.length < anzahl) {
    teile.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return baueWurm("feind", teile, stand, startPos, pfad, kiStufe);
}
