import { SPEZIAL_ICON } from "../utils/icons";
import { SPEZIAL } from "../config/spezial";
import type { SpezialKey } from "../types";

interface Props {
  vorrat: Record<SpezialKey, number>;
  cooldownBis: Record<SpezialKey, number>;
  jetzt: number;
  aktivieren: (k: SpezialKey) => void;
}

export function SpezialButtons({ vorrat, cooldownBis, jetzt, aktivieren }: Props) {
  const reihenfolge: SpezialKey[] = ["eichhoernchen", "taube", "schildkroete"];
  return (
    <div className="absolute bottom-28 left-2 z-40 flex flex-col gap-1.5">
      {reihenfolge.map((k) => {
        const anzahl = vorrat[k] ?? 0;
        const cd = (cooldownBis[k] ?? 0) > jetzt;
        const Icon = SPEZIAL_ICON[k];
        const disabled = anzahl <= 0 || cd;
        return (
          <button
            key={k}
            type="button"
            onClick={() => aktivieren(k)}
            disabled={disabled}
            title={`${SPEZIAL[k].name} – ${SPEZIAL[k].beschreibung}`}
            className={`relative h-12 w-12 rounded-full ring-2 ring-emerald-900 shadow-lg transition-transform ${
              disabled
                ? "bg-slate-700 opacity-60"
                : "bg-gradient-to-br from-amber-300 to-amber-500 hover:scale-105"
            }`}
          >
            <Icon className="m-auto h-6 w-6 text-emerald-950" />
            <span className="absolute -bottom-1 -right-1 rounded-full bg-emerald-950 px-1 text-[10px] font-bold text-white ring-1 ring-white">
              {anzahl}
            </span>
          </button>
        );
      })}
    </div>
  );
}
