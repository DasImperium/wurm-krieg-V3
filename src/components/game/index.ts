/**
 * Game Components Index
 */

// 1. REINE Typen exportieren
export type {
  SpielfeldProps,
  SpielRefs,
} from "./types";

export type {
  SegmentKey,
  SegmentDef,
  Upgrades,
  UeberfallFortschritt,
  GespeicherterFortschritt
} from "./segments";

// 2. Konstanten exportieren
export {
  PRODUKTION_KOSTEN,
  VERTEIDIGUNG_KOSTEN,
  PRODUKTION_RATE,
  VERTEIDIGUNG_BONUS,
  KANONEN_SCHADEN,
  KANONEN_REICHWEITE,
  KANONEN_INTERVALL_MS,
  BASIS_HP_GRUND,
  TICK_MS,
  SPIELER_BASIS_X,
  GEGNER_BASIS_X,
  ANZAHL_PFADE,
} from "./constants";

export {
  UPGRADE_KOSTEN,
  MAX_STUFE,
  SEGMENTE,
  SEGMENT_REIHENFOLGE,
  STANDARD_UPGRADES,
  STANDARD_UEBERFALL,
  SPEICHER_SCHLUESSEL
} from "./segments";

// 3. Hilfsfunktionen exportieren
export {
  getNextIdZaehler,
  getNextWurmId,
  getNextFallId,
  getNextMineId,
  getNextEffektId,
  halbeWurmLaenge,
  kopfX,
  segmentKosten,
  baueSegment,
  baueWurm,
  wurmGeschwindigkeit,
  kettenhemdReduktion,
  nahkampfSchaden,
  schadenAnWurm,
  zufallsWurmGegner,
  wurmIdZaehler,
  fallIdZaehler,
  mineIdZaehler,
  effektIdZaehler,
} from "./wurmUtils";

// 4. Speicher- und Ladefunktionen exportieren
export {
  standardFortschritt,
  ladeFortschritt,
  speichereFortschritt,
  segmentFarbe
} from "./utils"; // Falls segmentFarbe in utils liegt

// Alternativ aus segments falls dort definiert:
export { ladeFortschritt as ladeSpiel, speichereFortschritt as speichereSpiel } from "./segments";

// 5. Haupt-Ansichten exportieren
export { default as Hauptmenue } from "./Hauptmenue";
export { default as Spielfeld } from "./Spielfeld";
export { default as Ueberfall } from "./Ueberfall";
export { default as AdminPanel } from "./AdminPanel";
