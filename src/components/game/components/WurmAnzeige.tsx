import { Smile, Leaf } from "lucide-react";
import type { Wurm } from "../types";
import { SEGMENTE } from "../config/segmente";
import { SEGMENT_ICON } from "../utils/icons";
import { lebenSumme } from "../utils/wurmBerechnung";
import { Lebensbalken } from "./Lebensbalken";

interface Props {
  wurm: Wurm;
  feldBreite: number;
}

export function WurmAnzeige({ wurm, feldBreite }: Props) {
  const flash = performance.now() < wurm.flashBis;
  const baretFarbe = wurm.seite === "spieler" ? "bg-blue-600" : "bg-red-600";
  const xPercent = (wurm.pos / feldBreite) * 100;
  const kopfRechts = wurm.seite === "spieler";
  const laneOffset = 30 + wurm.pfad * 56;
  const { hp, max } = lebenSumme(wurm);

  const baseScale = "transition-all duration-300";
  const platzAnim = wurm.sterbend ? "scale-125 opacity-0 -translate-y-4" : "";

  // Sterbende Würmer ausblenden lassen, aber kurz noch sichtbar
  return (
    <div
      className="absolute"
      style={{
        left: `${xPercent}%`,
        bottom: `${laneOffset}px`,
        transform: "translateX(-50%)",
      }}
    >
      <Lebensbalken hp={hp} max={max} spielerSeite={wurm.seite === "spieler"} />
      <div className={`flex items-end gap-0.5 ${platzAnim}`}>
        {(kopfRechts ? [...wurm.segmente].reverse() : wurm.segmente).map((s, i, arr) => {
          const istKopf = (kopfRechts ? i === arr.length - 1 : i === 0);
          const istSchwanz = (kopfRechts ? i === 0 : i === arr.length - 1) && arr.length > 1;
          const pulse = flash ? "ring-4 ring-red-500" : "";
          const def = SEGMENTE[s.key];
          const Icon = SEGMENT_ICON[s.key];

          if (istKopf) {
            return (
              <div key={i} className={`relative ${baseScale}`}>
                <div
                  className={`relative h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 ring-2 ring-emerald-900 shadow ${pulse}`}
                >
                  <div className={`absolute -top-2 left-1 h-2.5 w-7 rounded-md ${baretFarbe} shadow`} />
                  <Smile className="absolute inset-0 m-auto h-5 w-5 text-emerald-950" />
                </div>
              </div>
            );
          }

          if (istSchwanz) {
            return (
              <div key={i} className={baseScale}>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-800 ring-2 ring-emerald-900 shadow ${pulse}`}
                >
                  <Leaf className="h-3.5 w-3.5 -rotate-45 text-emerald-100" fill="currentColor" />
                </div>
              </div>
            );
          }

          const tot = s.hp <= 0;
          return (
            <div key={i} className={baseScale} title={`${def.name} L${s.stufe}`}>
              <div
                className={`relative flex h-9 w-9 items-center justify-center rounded-full ${def.farbe} ring-2 ring-emerald-900 shadow ${pulse} ${tot ? "opacity-40 grayscale" : ""}`}
              >
                <Icon className="h-4 w-4 text-white" />
                {s.stufe > 1 && (
                  <span className="absolute -bottom-1 -right-1 rounded-full bg-yellow-300 px-1 text-[8px] font-bold text-emerald-950 ring-1 ring-emerald-900">
                    {s.stufe}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
