/**
 * Game Components Index
 * Exportiert alle Komponenten und Utilities für das Spiel sauber ohne Kreis-Importe.
 */

// 1. Typen exportieren
export type {
  Segment,
  Wurm,
  FallObjekt,
  Mine,
  WaffenEffekt,
  KanonenBlitz,
  SpielfeldProps,
  SpielRefs,
} from "./types";

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

// 3. Hilfsfunktionen (wurmUtils) exportieren
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

// 4. Allgemeine Utilities exportieren
export { segmentFarbe } from "./utils";

// 5. Haupt-Ansichten exportieren
export { default as Hauptmenue } from "./Hauptmenue";
export { default as Spielfeld } from "./Spielfeld";
export { default as Ueberfall } from "./Ueberfall";
export { default as AdminPanel } from "./AdminPanel";

// 6. Unterkomponenten exportieren (Diese liegen laut Struktur im Unterordner "./components/")
export { default as Baum } from "./components/Baum";
export { default as KopfSymbol } from "./components/KopfSymbol";
export { default as SchwanzSymbol } from "./components/SchwanzSymbol";
export { default as SegmentIcon } from "./components/SegmentIcon";
export { default as SegmentSymbolMitIcon } from "./components/SegmentSymbolMitIcon";
export { default as Wurmanzeige } from "./components/Wurmanzeige";
export { default as EndBildschirm } from "./components/EndBildschirm";
