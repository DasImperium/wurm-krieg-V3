import type { SegmentKey } from "../types";

export interface LevelConfig {
  level: number;
  /** Spielfeldbreite in Wurmsegmenten (60..100) */
  feldBreite: number;
  baumHp: number;
  /** Maximal 8 Segmente, aus denen die KI ihre Würmer baut */
  kiSegmentAuswahl: SegmentKey[];
  /** Stufe 1..5, mit der die KI ihre Segmente verwendet */
  kiStufe: number;
  /** Spawn-Intervall der KI in ms */
  kiSpawnIntervall: number;
}

const KI_POOLS: SegmentKey[][] = [
  ["beine", "mg", "panzer"],
  ["beine", "mg", "panzer", "kettenhemd"],
  ["beine", "mg", "panzer", "kettenhemd", "schall", "kastanie"],
  ["beine", "mg", "panzer", "kettenhemd", "schall", "kastanie", "stachel", "honigpumpe"],
  ["beine", "mg", "panzer", "kettenhemd", "laser", "granatwerfer", "flammenwerfer", "raketenwerfer"],
  ["beine", "mg", "panzer", "kettenhemd", "laser", "raketenwerfer", "spinnenest", "larven"],
];

export const LEVELS: LevelConfig[] = Array.from({ length: 100 }, (_, i) => {
  const level = i + 1;
  const breite = [60, 70, 80, 90, 100][i % 5];
  const stufe = Math.min(5, 1 + Math.floor(i / 20));
  const poolIdx = Math.min(KI_POOLS.length - 1, Math.floor(i / 18));
  return {
    level,
    feldBreite: breite,
    baumHp: 150 + level * 35,
    kiSegmentAuswahl: KI_POOLS[poolIdx].slice(0, 8),
    kiStufe: stufe,
    kiSpawnIntervall: Math.max(2200, 6000 - level * 35),
  };
});

export function levelConfig(level: number): LevelConfig {
  return LEVELS[Math.min(LEVELS.length - 1, Math.max(0, level - 1))];
}
