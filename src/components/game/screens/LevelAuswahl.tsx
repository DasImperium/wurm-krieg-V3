import { ArrowLeft, Lock } from "lucide-react";
import type { Spielstand } from "../types";

interface Props {
  stand: Spielstand;
  start: (level: number) => void;
  zurueck: () => void;
}

export function LevelAuswahl({ stand, start, zurueck }: Props) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={zurueck} className="flex items-center gap-1 rounded bg-slate-700 px-3 py-2 text-sm font-bold hover:bg-slate-600">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </button>
        <h1 className="text-2xl font-extrabold">Level wählen</h1>
        <span className="text-sm">Höchstes: {stand.hoechstesLevel}/100</span>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((lvl) => {
          const frei = lvl <= stand.hoechstesLevel;
          return (
            <button
              key={lvl}
              disabled={!frei}
              onClick={() => start(lvl)}
              className={`flex aspect-square items-center justify-center rounded-lg text-sm font-bold ring-1 ring-white/10 ${
                frei ? "bg-emerald-700 hover:bg-emerald-600 text-white" : "bg-slate-700 text-slate-400"
              }`}
            >
              {frei ? lvl : <Lock className="h-3 w-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LevelAuswahl;
