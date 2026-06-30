import type { SegmentInstanz, SegmentKey, Wurm } from "../types";
import { SEGMENTE } from "../config/segmente";

/** Basis-Geschwindigkeit in Segmenten / Sekunde. */
export const BASIS_SPEED = 1.6;

export function wurmGeschwindigkeit(wurm: Wurm): number {
  let faktor = 1;
  for (const s of wurm.segmente) faktor *= SEGMENTE[s.key].speedFaktor;
  const slow = wurm.langsamBis > performance.now() ? wurm.langsamFaktor : 1;
  return BASIS_SPEED * faktor * slow;
}

export function lebenSumme(wurm: Wurm): { hp: number; max: number } {
  let hp = 0;
  let max = 0;
  for (const s of wurm.segmente) {
    hp += Math.max(0, s.hp);
    max += s.hpMax;
  }
  return { hp, max };
}

/** Verteilt Schaden von vorne nach hinten. Wurm stirbt erst bei 0 Gesamt-HP. */
export function schadenAnWurm(wurm: Wurm, schaden: number): void {
  if (!wurm.lebend) return;
  const reduziert = wurm.kettenhemdReduktion
    ? schaden * (1 - wurm.kettenhemdReduktion)
    : schaden;
  let rest = reduziert;
  for (let i = 0; i < wurm.segmente.length && rest > 0; i++) {
    const seg = wurm.segmente[i];
    if (seg.hp <= 0) continue;
    const take = Math.min(seg.hp, rest);
    seg.hp -= take;
    rest -= take;
  }
  wurm.flashBis = performance.now() + 120;
  if (lebenSumme(wurm).hp <= 0) {
    wurm.lebend = false;
    wurm.sterbend = true;
  }
}

export function neueSegmentInstanz(key: SegmentKey, stufe: number): SegmentInstanz {
  const hp = SEGMENTE[key].hp[Math.min(4, Math.max(0, stufe - 1))];
  return { key, stufe, hp, hpMax: hp };
}

let WURM_ID = 1;
export const naechsteWurmId = () => WURM_ID++;
