import { Heart } from "lucide-react";

interface BaumProps {
  seite: "links" | "rechts";
  name: string;
  farbe: "emerald" | "rose";
  hp: number;
  hpMax: number;
}

export function Baum({ seite, name, farbe, hp, hpMax }: BaumProps) {
  const pos = seite === "links" ? "left-2" : "right-2";
  const krone = farbe === "emerald" ? "bg-emerald-700" : "bg-rose-700";
  const kroneHell = farbe === "emerald" ? "bg-emerald-500" : "bg-rose-500";
  const prozent = Math.max(0, Math.round((hp / Math.max(1, hpMax)) * 100));

  return (
    <div className={`absolute bottom-0 ${pos} z-30 flex w-24 flex-col items-center`}>
      <div className="mb-1 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
        <Heart className="h-3 w-3 text-red-400" />
        {Math.max(0, hp)}/{hpMax}
      </div>
      <div className="mb-1 h-1.5 w-20 overflow-hidden rounded bg-black/40">
        <div
          className={`h-full ${farbe === "emerald" ? "bg-emerald-400" : "bg-rose-400"}`}
          style={{ width: `${prozent}%` }}
        />
      </div>
      <div className="relative">
        <div className={`h-24 w-24 rounded-full ${krone} shadow-2xl ring-4 ring-emerald-900/40`} />
        <div className={`absolute left-3 top-3 h-7 w-7 rounded-full ${kroneHell} opacity-60`} />
        <div className={`absolute right-4 top-6 h-4 w-4 rounded-full ${kroneHell} opacity-60`} />
      </div>
      <div className="-mt-6 h-20 w-8 rounded bg-gradient-to-b from-amber-800 to-amber-950 shadow-inner" />
      <div className="absolute -top-7 rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-white shadow">
        {name}
      </div>
    </div>
  );
}
