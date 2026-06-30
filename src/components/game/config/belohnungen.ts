import type { SegmentKey, SpezialKey } from "../types";

/**
 * Belohnungen je Level.
 *
 * ============================================================================
 *  ANLEITUNG: Wie passe ich Belohnungen an?
 * ============================================================================
 *
 * Jeder Eintrag in `BELOHNUNGEN` ist ein Objekt vom Typ `LevelBelohnung`:
 *
 *   {
 *     apfelBasis: number,              // Wird IMMER vergeben
 *     apfelProAufgesammeltem: number,  // Multiplikator * Äpfel aus der Runde
 *     sternanis?: number,              // Optional: fester Sternanis-Bonus
 *     freischaltSegment?: SegmentKey,  // Schaltet dieses Segment auf Stufe 1 frei
 *     freischaltSegmentStufe?: number, // Alternativ: setzt eine bestimmte Stufe (max 5)
 *     spezial?: { key: SpezialKey, anzahl: number }, // Schenkt Spezialfähigkeiten
 *     text?: string,                   // Beliebige Beschreibung im Sieg-Screen
 *   }
 *
 * STANDARDREGEL (laut Anforderung): Ohne Eintrag wird `5 + n` Äpfel vergeben,
 * wobei n = die in der Schlacht aufgesammelten Äpfel sind.
 *
 * Beispiele:
 *   BELOHNUNGEN[5]  = { apfelBasis: 5,  apfelProAufgesammeltem: 1,
 *                       freischaltSegment: "schall",
 *                       text: "Schallkanone freigeschaltet!" };
 *   BELOHNUNGEN[10] = { apfelBasis: 20, apfelProAufgesammeltem: 2,
 *                       spezial: { key: "taube", anzahl: 1 } };
 *   BELOHNUNGEN[25] = { apfelBasis: 50, apfelProAufgesammeltem: 3,
 *                       sternanis: 5, text: "Sternanis-Bonus" };
 *
 * Einfach Einträge mit der Level-Nummer (1-basiert) als Schlüssel ergänzen oder
 * ändern. Wo kein eigener Eintrag steht, greift `STANDARD_BELOHNUNG`.
 * ============================================================================
 */
export interface LevelBelohnung {
  apfelBasis: number;
  apfelProAufgesammeltem: number;
  sternanis?: number;
  freischaltSegment?: SegmentKey;
  freischaltSegmentStufe?: number;
  spezial?: { key: SpezialKey; anzahl: number };
  text?: string;
}

export const STANDARD_BELOHNUNG: LevelBelohnung = {
  apfelBasis: 5,
  apfelProAufgesammeltem: 1,
};

export const BELOHNUNGEN: Record<number, LevelBelohnung> = {
  // Hier individuelle Belohnungen einfügen. Beispiel:
  // 3: { apfelBasis: 10, apfelProAufgesammeltem: 1, freischaltSegment: "kastanie",
  //      text: "Kastanien-Werfer freigeschaltet!" },
};

export function belohnungFuerLevel(level: number): LevelBelohnung {
  return BELOHNUNGEN[level] ?? STANDARD_BELOHNUNG;
}
