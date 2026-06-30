import { useState } from "react";
import { Apple, Bird, BookOpen, FlaskConical, Shield, Swords, Trash2, Sparkles } from "lucide-react";
import type { Spielstand } from "./types";
import { Sternanis } from "./Sternanis";

interface Props {
  stand: Spielstand;
  setStand: (s: Spielstand) => void;
  zuLevel: () => void;
  zuForschung: () => void;
  zuAnleitung: () => void;
  zuMinigame: () => void;
  zuAdmin: () => void;
  reset: () => void;
}

export function Hauptmenue({
  stand, zuLevel, zuForschung, zuAnleitung, zuMinigame, zuAdmin, reset,
}: Props) {
  const [bestaetigen, setBestaetigen] = useState(0);

  const handleReset = () => {
    if (bestaetigen === 0) { setBestaetigen(1); return; }
    if (bestaetigen === 1) { setBestaetigen(2); return; }
    reset();
    setBestaetigen(0);
  };

  return (
    <div className="mx-auto w-full max-w-2xl text-center">
      <h1 className="mb-1 text-4xl font-extrabold tracking-tight text-emerald-300 drop-shadow">
        Krieg der Würmer
      </h1>
      <p className="mb-6 text-sm text-slate-300">Wurmkrieg 2</p>

      <div className="mb-6 flex items-center justify-center gap-4 text-sm">
        <span className="flex items-center gap-1"><Apple className="h-4 w-4 text-red-400" /> {stand.apfel}</span>
        <span className="flex items-center gap-1"><Sternanis /> {stand.sternanis}</span>
        <span className="flex items-center gap-1"><Swords className="h-4 w-4" /> Lvl {stand.hoechstesLevel}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={zuLevel} className="flex flex-col items-center rounded-xl bg-emerald-600 p-4 font-bold text-white hover:bg-emerald-500">
          <Swords className="mb-1 h-6 w-6" /> Schlacht
        </button>
        <button onClick={zuForschung} className="flex flex-col items-center rounded-xl bg-blue-600 p-4 font-bold text-white hover:bg-blue-500">
          <FlaskConical className="mb-1 h-6 w-6" /> Forschung
        </button>
        <button onClick={zuMinigame} className="flex flex-col items-center rounded-xl bg-yellow-600 p-4 font-bold text-white hover:bg-yellow-500">
          <Bird className="mb-1 h-6 w-6" /> Überfall
        </button>
        <button onClick={zuAnleitung} className="flex flex-col items-center rounded-xl bg-slate-600 p-4 font-bold text-white hover:bg-slate-500">
          <BookOpen className="mb-1 h-6 w-6" /> Anleitung
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <button onClick={zuAdmin} className="flex items-center gap-1 rounded bg-slate-700 px-3 py-1.5 text-xs hover:bg-slate-600">
          <Shield className="h-3.5 w-3.5" /> Admin
        </button>
        <button onClick={handleReset} className={`flex items-center gap-1 rounded px-3 py-1.5 text-xs ${
          bestaetigen === 0 ? "bg-slate-700 hover:bg-slate-600" : bestaetigen === 1 ? "bg-amber-600" : "bg-rose-600"
        }`}>
          <Trash2 className="h-3.5 w-3.5" />
          {bestaetigen === 0 ? "Reset" : bestaetigen === 1 ? "Sicher?" : "Wirklich!"}
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400">
        <Sparkles className="h-3 w-3" /> Cartoon-Style · Lokale Speicherung
      </div>
    </div>
  );
}

export default Hauptmenue;
