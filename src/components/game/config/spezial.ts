import type { SpezialDef, SpezialKey } from "../types";

export const SPEZIAL: Record<SpezialKey, SpezialDef> = {
  eichhoernchen: {
    key: "eichhoernchen",
    name: "Eichhörnchen",
    beschreibung:
      "Ein Eichhörnchen erscheint und füllt den kompletten Blättervorrat der aktuellen Runde wieder auf.",
    freischaltApfel: 40,
    freischaltSternanis: 0,
    steigerung: 1.5,
  },
  taube: {
    key: "taube",
    name: "Die Taube",
    beschreibung:
      "Eine Taube fliegt von links nach rechts und bombardiert das ganze Spielfeld. Anschließend liegen 6 s lang Minen auf dem Feld.",
    freischaltApfel: 80,
    freischaltSternanis: 5,
    steigerung: 1.7,
  },
  schildkroete: {
    key: "schildkroete",
    name: "Schildkröte",
    beschreibung:
      "Schildkröte kriecht über das Feld. Solange sie unterwegs ist, sind alle feindlichen Würmer 35 % langsamer.",
    freischaltApfel: 60,
    freischaltSternanis: 3,
    steigerung: 1.6,
  },
};

export function spezialKosten(
  key: SpezialKey,
  bereitsBesessen: number,
): { apfel: number; sternanis: number } {
  const def = SPEZIAL[key];
  const f = Math.pow(def.steigerung, bereitsBesessen);
  return {
    apfel: Math.round(def.freischaltApfel * f),
    sternanis: Math.round(def.freischaltSternanis * f),
  };
}
