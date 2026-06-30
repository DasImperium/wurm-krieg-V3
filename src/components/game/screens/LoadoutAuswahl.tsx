import { ArrowLeft, Check } from "lucide-react";
import type { Spielstand, SegmentKey } from "../types";
import { SEGMENTE, ALLE_SEGMENT_KEYS } from "../config/segmente";
import { SEGMENT_ICON } from "../utils/icons";

interface Props {
  stand: Spielstand;
  setStand: (s: Spielstand) => void;
  weiter: () => void;
  zurueck: () => void;
}

export function LoadoutAuswahl({ stand, setStand, weiter, zurueck }: Props) {
  const verfuegbar = ALLE_SEGMENT_KEYS.filter((k) => (stand.segmentStufen[k] ?? 0) > 0);

  const toggle = (k: SegmentKey) => {
    const ist = stand.loadout.includes(k);
    let neu: SegmentKey[];
    if (ist) neu = stand.loadout.filter((x) => x !== k);
    else if (stand.loadout.length >= 8) return;
    else neu = [...stand.loadout, k];
    setStand({ ...stand, loadout: neu });
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={zurueck} className="flex items-center gap-1 rounded bg-slate-700 px-3 py-2 text-sm font-bold hover:bg-slate-600">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </button>
        <h1 className="text-xl font-extrabold">Loadout · {stand.loadout.length}/8</h1>
        <button
          onClick={weiter}
          disabled={stand.loadout.length < 1}
          className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-40"
        >
          <Check className="h-4 w-4" /> Schlacht starten
        </button>
      </div>
      <p className="mb-3 text-sm text-slate-300">
        Wähle 1–8 verschiedene Segmente, aus denen du in der Schlacht deine Würmer (1–6 Segmente pro Wurm) bauen kannst.
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {verfuegbar.map((k) => {
          const def = SEGMENTE[k];
          const stufe = stand.segmentStufen[k] ?? 0;
          const aktiv = stand.loadout.includes(k);
          const Icon = SEGMENT_ICON[k];
          return (
            <button
              key={k}
              onClick={() => toggle(k)}
              className={`flex flex-col items-center rounded-lg p-3 ring-2 ${
                aktiv ? "bg-emerald-700 ring-emerald-300" : "bg-slate-800 ring-white/10 hover:bg-slate-700"
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${def.farbe}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <span className="mt-2 text-sm font-bold">{def.name}</span>
              <span className="text-xs text-emerald-300">Stufe {stufe}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LoadoutAuswahl;
