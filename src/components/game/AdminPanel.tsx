import { useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import type { Spielstand, SegmentKey, SpezialKey } from "./types";
import { ALLE_SEGMENT_KEYS, SEGMENTE } from "./config/segmente";

interface Props {
  stand: Spielstand;
  setStand: (s: Spielstand) => void;
  zurueck: () => void;
}

export function AdminPanel({ stand, setStand, zurueck }: Props) {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");

  if (!auth) {
    return (
      <div className="mx-auto w-full max-w-sm rounded-xl bg-slate-800 p-5 ring-1 ring-white/10">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={zurueck} className="rounded bg-slate-700 px-3 py-1.5 text-sm font-bold hover:bg-slate-600">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="flex items-center gap-1 text-lg font-bold"><Lock className="h-4 w-4" /> Admin</h1>
          <div />
        </div>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Passwort"
          className="w-full rounded bg-slate-700 px-3 py-2 text-white outline-none"
        />
        <button
          onClick={() => setAuth(pw === "Imperium")}
          className="mt-3 w-full rounded bg-emerald-600 py-2 font-bold text-white hover:bg-emerald-500"
        >
          Einloggen
        </button>
      </div>
    );
  }

  const alleAuf = (stufe: number) => {
    const neu: Partial<Record<SegmentKey, number>> = {};
    for (const k of ALLE_SEGMENT_KEYS) neu[k] = stufe;
    setStand({ ...stand, segmentStufen: neu });
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={zurueck} className="rounded bg-slate-700 px-3 py-2 text-sm font-bold hover:bg-slate-600">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        <div />
      </div>

      <div className="rounded-lg bg-slate-800 p-3 ring-1 ring-white/10">
        <h2 className="font-bold">Währung & Level</h2>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <label>Äpfel<input type="number" value={stand.apfel} onChange={(e) => setStand({ ...stand, apfel: Number(e.target.value) })} className="mt-1 w-full rounded bg-slate-700 px-2 py-1" /></label>
          <label>Sternanis<input type="number" value={stand.sternanis} onChange={(e) => setStand({ ...stand, sternanis: Number(e.target.value) })} className="mt-1 w-full rounded bg-slate-700 px-2 py-1" /></label>
          <label>Höchstes Level<input type="number" min={1} max={100} value={stand.hoechstesLevel} onChange={(e) => setStand({ ...stand, hoechstesLevel: Number(e.target.value) })} className="mt-1 w-full rounded bg-slate-700 px-2 py-1" /></label>
        </div>
      </div>

      <div className="rounded-lg bg-slate-800 p-3 ring-1 ring-white/10">
        <h2 className="font-bold">Alle Segmente auf Stufe…</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => alleAuf(s)} className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-bold hover:bg-emerald-500">
              Stufe {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-slate-800 p-3 ring-1 ring-white/10">
        <h2 className="font-bold">Einzelne Segment-Stufen (0 = gesperrt)</h2>
        <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {ALLE_SEGMENT_KEYS.map((k) => {
            const aktuell = stand.segmentStufen[k] ?? 0;
            return (
              <label key={k} className="flex items-center justify-between gap-2 rounded bg-slate-700/60 px-2 py-1 text-xs">
                <span className="font-semibold">{SEGMENTE[k].name}</span>
                <select
                  value={aktuell}
                  onChange={(e) =>
                    setStand({
                      ...stand,
                      segmentStufen: { ...stand.segmentStufen, [k]: Number(e.target.value) },
                    })
                  }
                  className="rounded bg-slate-900 px-2 py-1 text-white"
                >
                  {[0, 1, 2, 3, 4, 5].map((s) => (
                    <option key={s} value={s}>Stufe {s}</option>
                  ))}
                </select>
              </label>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg bg-slate-800 p-3 ring-1 ring-white/10">
        <h2 className="font-bold">Spezialfähigkeiten</h2>
        <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
          {(Object.keys(stand.spezial) as SpezialKey[]).map((k) => (
            <label key={k} className="capitalize">{k}
              <input
                type="number"
                value={stand.spezial[k]}
                onChange={(e) => setStand({ ...stand, spezial: { ...stand.spezial, [k]: Number(e.target.value) } })}
                className="mt-1 w-full rounded bg-slate-700 px-2 py-1"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-slate-800 p-3 ring-1 ring-white/10">
        <h2 className="font-bold">Spezial-Tuning</h2>
        <div className="mt-2 grid grid-cols-1 gap-3 text-sm">
          <label>
            Schildkröte Geschwindigkeit (Segmente/s): <b>{stand.admin.schildkroeteSpeed.toFixed(2)}</b>
            <input type="range" min={0.1} max={5} step={0.1} value={stand.admin.schildkroeteSpeed}
              onChange={(e) => setStand({ ...stand, admin: { ...stand.admin, schildkroeteSpeed: Number(e.target.value) } })}
              className="mt-1 w-full" />
          </label>
          <label>
            Taube Minen-Dichte (1–10 pro 10 Segmente): <b>{stand.admin.taubeMineDichte}</b>
            <input type="range" min={1} max={10} step={1} value={stand.admin.taubeMineDichte}
              onChange={(e) => setStand({ ...stand, admin: { ...stand.admin, taubeMineDichte: Number(e.target.value) } })}
              className="mt-1 w-full" />
          </label>
          <label>
            Taube Minen-Dauer (s): <b>{stand.admin.taubeMineDauer}</b>
            <input type="range" min={2} max={20} step={1} value={stand.admin.taubeMineDauer}
              onChange={(e) => setStand({ ...stand, admin: { ...stand.admin, taubeMineDauer: Number(e.target.value) } })}
              className="mt-1 w-full" />
          </label>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
