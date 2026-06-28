/**
 * Game Components Index
 * Exportiert alle Komponenten und Utilities für das Spiel
 */

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
  resetIdZaehler,
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

export { segmentFarbe } from "./utils";

export { default as Spielfeld } from "./Spielfeld";

export { default as Baum } from "./components/Baum";
export { default as KopfSymbol } from "./components/KopfSymbol";
export { default as SchwanzSymbol } from "./components/SchwanzSymbol";
export { default as SegmentIcon } from "./components/SegmentIcon";
export { default as SegmentSymbolMitIcon } from "./components/SegmentSymbolMitIcon";
export { default as WurmAnzeige } from "./components/WurmAnzeige";
export { default as EndBildschirm } from "./components/EndBildschirm";