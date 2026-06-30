import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Apple, Bird, Heart, Skull, Plus, Leaf } from "lucide-react";
import type { Spielstand } from "./types";
import { Sternanis } from "./Sternanis";

interface Props {
  stand: Spielstand;
  setStand: (s: Spielstand) => void;
  zurueck: () => void;
}

type LootArt = "rotApfel" | "gruenApfel" | "sternanis" | "heilung" | "gift";
interface Loot {
  id: number;
  x: number;
  start: number;
  dauer: number;
  art: LootArt;
}

const LOOT_FARBEN: Record<LootArt, string> = {
  rotApfel: "bg-red-500 ring-red-900",
  gruenApfel: "bg-emerald-500 ring-emerald-900",
  sternanis: "bg-yellow-400 ring-yellow-800",
  heilung: "bg-amber-300 ring-amber-700",
  gift: "bg-purple-600 ring-purple-900",
};

export function Ueberfall({ stand, setStand, zurueck }: Props) {
  const [miniLevel, setMiniLevel] = useState(1);
  const [bossHp, setBossHp] = useState(150);
  const bossHpMax = 100 + miniLevel * 60;
  const [schmetterlinge, setSchmetterlinge] = useState(3);
  const [schmetterlingHp, setSchmetterlingHp] = useState(20 + miniLevel * 6);
  const [eingesammelt, setEingesammelt] = useState({ rot: 0, gruen: 0, anis: 0 });
  const [feuern, setFeuern] = useState(false);
  const [items, setItems] = useState<Loot[]>([]);
  const [ende, setEnde] = useState<"sieg" | "niederlage" | null>(null);
  const letzterAngriff = useRef(0);
  const [, force] = useState(0);

  // Kampf-Tick
  useEffect(() => {
    if (ende) return;
    const iv = setInterval(() => {
      const jetzt = performance.now();
      force((n) => (n + 1) % 1000);
      // Schmetterlinge feuern auf den Baum
      if (jetzt - letzterAngriff.current > 700 && schmetterlinge > 0) {
        letzterAngriff.current = jetzt;
        setFeuern(true);
        setTimeout(() => setFeuern(false), 200);
        setBossHp((hp) => Math.max(0, hp - schmetterlinge * (2 + miniLevel)));
      }
      // Baum-Kanone trifft zufällig einen Schmetterling
      if (Math.random() < 0.18 && schmetterlinge > 0) {
        setSchmetterlingHp((hp) => {
          const neu = hp - (5 + miniLevel * 2);
          if (neu <= 0) {
            setSchmetterlinge((s) => Math.max(0, s - 1));
            return 20 + miniLevel * 6;
          }
          return neu;
        });
      }
      // Loot droppt
      if (Math.random() < 0.55) {
        const r = Math.random();
        const art: LootArt =
          r < 0.35 ? "rotApfel"
          : r < 0.6 ? "gruenApfel"
          : r < 0.78 ? "sternanis"
          : r < 0.92 ? "heilung"
          : "gift";
        setItems((cur) => [
          ...cur.filter((i) => jetzt - i.start < i.dauer + 600),
          { id: Math.random(), x: 8 + Math.random() * 84, start: jetzt, dauer: 3500 + Math.random() * 1500, art },
        ]);
      }
    }, 200);
    return () => clearInterval(iv);
  }, [ende, schmetterlinge, miniLevel]);

  useEffect(() => {
    if (ende) return;
    if (bossHp <= 0) setEnde("sieg");
    else if (schmetterlinge <= 0) setEnde("niederlage");
  }, [bossHp, schmetterlinge, ende]);

  const sammeln = (i: Loot) => {
    setItems((cur) => cur.filter((x) => x.id !== i.id));
    if (i.art === "rotApfel") setEingesammelt((e) => ({ ...e, rot: e.rot + 1 }));
    if (i.art === "gruenApfel") setEingesammelt((e) => ({ ...e, gruen: e.gruen + 1 }));
    if (i.art === "sternanis") setEingesammelt((e) => ({ ...e, anis: e.anis + 1 }));
    if (i.art === "heilung") setSchmetterlingHp((hp) => Math.min(20 + miniLevel * 6, hp + 8));
    if (i.art === "gift") setSchmetterlinge((s) => Math.max(0, s - 1));
  };

  const kaufeSchmetterling = () => {
    if (miniLevel <= 15) {
      const k = 25;
      if (stand.apfel < k) return;
      setStand({ ...stand, apfel: stand.apfel - k });
    } else {
      const k = 3;
      if (stand.sternanis < k) return;
      setStand({ ...stand, sternanis: stand.sternanis - k });
    }
    setSchmetterlinge((s) => s + 1);
  };

  const beenden = () => {
    if (ende === "sieg") {
      setStand({
        ...stand,
        apfel: stand.apfel + eingesammelt.rot + eingesammelt.gruen * 2 + 5,
        sternanis: stand.sternanis + eingesammelt.anis + 1,
      });
      setMiniLevel((l) => l + 1);
      setBossHp(100 + (miniLevel + 1) * 60);
      setSchmetterlinge(3);
      setSchmetterlingHp(20 + (miniLevel + 1) * 6);
      setEingesammelt({ rot: 0, gruen: 0, anis: 0 });
      setEnde(null);
    } else zurueck();
  };

  const jetzt = performance.now();
  const bossProz = Math.round((bossHp / Math.max(1, bossHpMax)) * 100);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
      <div className="flex items-center justify-between">
        <button onClick={zurueck} className="rounded bg-slate-700 px-3 py-2 text-sm font-bold hover:bg-slate-600">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <Bird className="h-6 w-6 text-yellow-300" /> Überfall · Lvl {miniLevel}
        </h1>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1"><Apple className="h-3.5 w-3.5 text-red-400" />{stand.apfel}</span>
          <span className="flex items-center gap-1"><Sternanis className="h-3.5 w-3.5" />{stand.sternanis}</span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded bg-slate-800 px-3 py-2 text-xs">
        <span className="flex items-center gap-1"><Bird className="h-4 w-4 text-yellow-300" /> Schmetterlinge: {schmetterlinge} · HP {schmetterlingHp}</span>
        <span className="flex items-center gap-1"><Heart className="h-4 w-4 text-red-400" /> Boss: {Math.max(0, bossHp)}/{bossHpMax}</span>
        <button onClick={kaufeSchmetterling} className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 font-bold hover:bg-emerald-500">
          <Plus className="h-3 w-3" /> {miniLevel <= 15 ? "25🍎" : "3★"}
        </button>
      </div>

      <div className="relative h-[60vh] w-full overflow-hidden rounded-xl bg-gradient-to-b from-sky-300 to-emerald-300 ring-1 ring-white/10">
        {/* Boss-Baum mit fanatischem Ausdruck beim Feuern */}
        <div className="absolute left-1/2 top-6 -translate-x-1/2 flex flex-col items-center">
          <div className="mb-1 h-2 w-32 overflow-hidden rounded bg-black/30">
            <div className="h-full bg-rose-500" style={{ width: `${bossProz}%` }} />
          </div>
          <div className="relative h-32 w-32 rounded-full bg-emerald-700 ring-4 ring-emerald-900 shadow-2xl">
            <div className={`absolute left-6 top-10 h-3 w-3 rounded-full ${feuern ? "bg-red-500" : "bg-white"}`} />
            <div className={`absolute right-6 top-10 h-3 w-3 rounded-full ${feuern ? "bg-red-500" : "bg-white"}`} />
            <div className={`absolute left-1/2 top-20 h-2 w-12 -translate-x-1/2 rounded ${feuern ? "bg-red-700" : "bg-emerald-950"}`} />
          </div>
          <div className="-mt-2 h-16 w-10 rounded bg-gradient-to-b from-amber-800 to-amber-950" />
        </div>

        {/* Schmetterlinge */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
          {Array.from({ length: schmetterlinge }).map((_, i) => (
            <div key={i} className="text-3xl animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}>🦋</div>
          ))}
        </div>

        {/* Loot */}
        {items.map((i) => {
          const t = Math.min(1, (jetzt - i.start) / i.dauer);
          const top = -5 + t * 90;
          return (
            <button
              key={i.id}
              onClick={() => sammeln(i)}
              className={`absolute z-20 -translate-x-1/2 rounded-full p-2 shadow ring-2 hover:scale-110 ${LOOT_FARBEN[i.art]}`}
              style={{ left: `${i.x}%`, top: `${top}%` }}
              aria-label={i.art}
            >
              {i.art === "rotApfel" || i.art === "gruenApfel" ? <Apple className="h-4 w-4 text-white" />
                : i.art === "sternanis" ? <Sternanis className="h-4 w-4" />
                : i.art === "heilung" ? <Heart className="h-4 w-4 text-white" />
                : <Skull className="h-4 w-4 text-white" />}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded bg-slate-800 px-3 py-2 text-xs">
        <span className="flex items-center gap-1"><Apple className="h-3.5 w-3.5 text-red-400" /> Rot: {eingesammelt.rot}</span>
        <span className="flex items-center gap-1"><Leaf className="h-3.5 w-3.5 text-emerald-400" /> Grün: {eingesammelt.gruen}</span>
        <span className="flex items-center gap-1"><Sternanis className="h-3.5 w-3.5" /> {eingesammelt.anis}</span>
      </div>

      {ende && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-xl bg-slate-800 p-5 text-center ring-1 ring-white/10">
            <h2 className="mb-2 text-2xl font-extrabold">{ende === "sieg" ? "Sieg!" : "Niederlage"}</h2>
            <p className="mb-3 text-sm text-slate-300">
              {ende === "sieg"
                ? `Beute: ${eingesammelt.rot}🍎 ${eingesammelt.gruen}🍏 ${eingesammelt.anis}★ + Bonus`
                : "Alle Schmetterlinge gefallen."}
            </p>
            <button onClick={beenden} className="w-full rounded bg-emerald-600 py-2 font-bold hover:bg-emerald-500">
              {ende === "sieg" ? "Weiter" : "Zurück"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ueberfall;
