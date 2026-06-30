import { Plus, X, Send } from "lucide-react";
import type { SegmentKey, Spielstand } from "../types";
import { SEGMENTE, baukosten } from "../config/segmente";
import { SEGMENT_ICON } from "../utils/icons";

interface Props {
  loadout: SegmentKey[];
  stand: Spielstand;
  blatt: number;
  sternanisRunde: number;
  gewaehlt: SegmentKey[];
  setGewaehlt: (s: SegmentKey[]) => void;
  losschicken: () => void;
  schliessen: () => void;
}

export function WurmBauer({
  loadout,
  stand,
  blatt,
  sternanisRunde,
  gewaehlt,
  setGewaehlt,
  losschicken,
  schliessen,
}: Props) {
  const kostenSumme = gewaehlt.reduce(
    (acc, k) => {
      const stufe = stand.segmentStufen[k] ?? 1;
      const k2 = baukosten(k, stufe);
      return { blatt: acc.blatt + k2.blatt, sternanis: acc.sternanis + k2.sternanis };
    },
    { blatt: 0, sternanis: 0 },
  );
  const bezahlbar =
    kostenSumme.blatt <= blatt && kostenSumme.sternanis <= sternanisRunde;
  const gueltig = gewaehlt.length >= 1 && gewaehlt.length <= 6;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-2 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 p-4 ring-1 ring-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Wurm bauen (1–6 Segmente)</h3>
          <button onClick={schliessen} className="rounded p-1 text-white hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 min-h-12 rounded-lg bg-slate-900 p-2">
          {gewaehlt.length === 0 ? (
            <p className="text-center text-xs text-slate-400">Segmente auswählen…</p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {gewaehlt.map((k, i) => {
                const Icon = SEGMENT_ICON[k];
                return (
                  <button
                    key={i}
                    onClick={() => setGewaehlt(gewaehlt.filter((_, idx) => idx !== i))}
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${SEGMENTE[k].farbe} ring-2 ring-emerald-900`}
                    title="Entfernen"
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {loadout.map((k) => {
            const stufe = stand.segmentStufen[k] ?? 1;
            const ko = baukosten(k, stufe);
            const Icon = SEGMENT_ICON[k];
            const kannHinzu = gewaehlt.length < 6;
            return (
              <button
                key={k}
                onClick={() => kannHinzu && setGewaehlt([...gewaehlt, k])}
                disabled={!kannHinzu}
                className={`relative flex flex-col items-center rounded-lg p-2 ring-1 ring-white/10 ${
                  kannHinzu ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-700/40"
                }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${SEGMENTE[k].farbe}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className="mt-1 text-[10px] font-semibold text-white">{SEGMENTE[k].name}</span>
                <span className="text-[9px] text-emerald-300">{ko.blatt}🍃{ko.sternanis ? ` ${ko.sternanis}★` : ""}</span>
                <Plus className="absolute right-1 top-1 h-3 w-3 text-emerald-300" />
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-white">
          <span>
            Kosten: <b className="text-emerald-300">{kostenSumme.blatt}🍃</b>
            {kostenSumme.sternanis > 0 && <> <b className="text-yellow-300">{kostenSumme.sternanis}★</b></>}
          </span>
          <span>
            Vorrat: {blatt}🍃 {sternanisRunde}★
          </span>
        </div>

        <button
          onClick={losschicken}
          disabled={!gueltig || !bezahlbar}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white shadow hover:bg-emerald-500 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Wurm losschicken
        </button>
      </div>
    </div>
  );
}
