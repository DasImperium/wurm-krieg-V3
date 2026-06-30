import { ArrowLeft, Apple } from "lucide-react";
import type { Spielstand, SegmentKey, SpezialKey } from "../types";
import { SEGMENTE, ALLE_SEGMENT_KEYS, forschungskosten } from "../config/segmente";
import { SPEZIAL, spezialKosten } from "../config/spezial";
import { SEGMENT_ICON, SPEZIAL_ICON } from "../utils/icons";
import { Sternanis } from "../Sternanis";

interface Props {
  stand: Spielstand;
  setStand: (s: Spielstand) => void;
  zurueck: () => void;
}

export function Forschung({ stand, setStand, zurueck }: Props) {
  const kaufeSegment = (k: SegmentKey) => {
    const aktStufe = stand.segmentStufen[k] ?? 0;
    if (aktStufe >= 5) return;
    const zielStufe = aktStufe + 1;
    const ko = forschungskosten(k, zielStufe);
    if (stand.apfel < ko.apfel || stand.sternanis < ko.sternanis) return;
    setStand({
      ...stand,
      apfel: stand.apfel - ko.apfel,
      sternanis: stand.sternanis - ko.sternanis,
      segmentStufen: { ...stand.segmentStufen, [k]: zielStufe },
    });
  };

  const kaufeSpezial = (k: SpezialKey) => {
    const ko = spezialKosten(k, stand.spezial[k] ?? 0);
    if (stand.apfel < ko.apfel || stand.sternanis < ko.sternanis) return;
    setStand({
      ...stand,
      apfel: stand.apfel - ko.apfel,
      sternanis: stand.sternanis - ko.sternanis,
      spezial: { ...stand.spezial, [k]: (stand.spezial[k] ?? 0) + 1 },
    });
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={zurueck} className="flex items-center gap-1 rounded bg-slate-700 px-3 py-2 text-sm font-bold text-white hover:bg-slate-600">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </button>
        <h1 className="text-2xl font-extrabold">Forschung</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1"><Apple className="h-4 w-4 text-red-400" /> {stand.apfel}</span>
          <span className="flex items-center gap-1"><Sternanis /> {stand.sternanis}</span>
        </div>
      </div>

      <section className="mb-4">
        <h2 className="mb-2 text-lg font-bold">Segmente</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ALLE_SEGMENT_KEYS.map((k) => {
            const def = SEGMENTE[k];
            const stufe = stand.segmentStufen[k] ?? 0;
            const ko = stufe < 5 ? forschungskosten(k, stufe + 1) : null;
            const Icon = SEGMENT_ICON[k];
            const kannZahlen = ko ? stand.apfel >= ko.apfel && stand.sternanis >= ko.sternanis : false;
            return (
              <div key={k} className="flex items-center gap-3 rounded-lg bg-slate-800 p-3 ring-1 ring-white/10">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${def.farbe}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{def.name}</span>
                    <span className="rounded bg-emerald-700 px-1.5 text-xs">Stufe {stufe}/5</span>
                    {def.basis && <span className="rounded bg-blue-700 px-1.5 text-xs">Basis</span>}
                  </div>
                  <p className="text-xs text-slate-300">{def.beschreibung}</p>
                </div>
                {stufe < 5 ? (
                  <button
                    onClick={() => kaufeSegment(k)}
                    disabled={!kannZahlen}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-40"
                  >
                    {stufe === 0 ? "Freischalten" : `Stufe ${stufe + 1}`}
                    <div className="text-[10px] font-normal">
                      🍎 {ko!.apfel}{ko!.sternanis > 0 ? ` · ★ ${ko!.sternanis}` : ""}
                    </div>
                  </button>
                ) : (
                  <span className="rounded bg-yellow-600 px-2 py-1 text-xs font-bold">MAX</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">Spezialfähigkeiten</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(Object.keys(SPEZIAL) as SpezialKey[]).map((k) => {
            const def = SPEZIAL[k];
            const have = stand.spezial[k] ?? 0;
            const ko = spezialKosten(k, have);
            const Icon = SPEZIAL_ICON[k];
            const kann = stand.apfel >= ko.apfel && stand.sternanis >= ko.sternanis;
            return (
              <div key={k} className="rounded-lg bg-slate-800 p-3 ring-1 ring-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500">
                    <Icon className="h-5 w-5 text-emerald-950" />
                  </div>
                  <div>
                    <div className="font-bold">{def.name}</div>
                    <div className="text-xs text-slate-300">Vorrat: {have}</div>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-300">{def.beschreibung}</p>
                <button
                  onClick={() => kaufeSpezial(k)}
                  disabled={!kann}
                  className="mt-2 w-full rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-40"
                >
                  Kaufen · 🍎 {ko.apfel}{ko.sternanis > 0 ? ` · ★ ${ko.sternanis}` : ""}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Forschung;
