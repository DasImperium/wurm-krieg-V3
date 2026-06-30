interface LebensbalkenProps {
  hp: number;
  max: number;
  spielerSeite: boolean;
}

export function Lebensbalken({ hp, max, spielerSeite }: LebensbalkenProps) {
  const prozent = Math.max(0, Math.min(100, (hp / Math.max(1, max)) * 100));
  const farbe =
    prozent > 60 ? "bg-emerald-400" : prozent > 30 ? "bg-yellow-400" : "bg-red-500";
  return (
    <div className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center">
      <div className="rounded bg-black/70 px-1 text-[9px] font-bold leading-tight text-white">
        {Math.max(0, Math.round(hp))}/{max}
      </div>
      <div className="mt-0.5 h-1 w-14 overflow-hidden rounded bg-black/60 ring-1 ring-black/60">
        <div
          className={`h-full transition-all ${farbe}`}
          style={{ width: `${prozent}%` }}
        />
      </div>
      <div className={`mt-0.5 h-0.5 w-2 rounded ${spielerSeite ? "bg-blue-400" : "bg-red-400"}`} />
    </div>
  );
}
