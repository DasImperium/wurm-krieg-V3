import { useEffect, useMemo, useRef, useState } from "react";
import { Apple, Leaf, Pause, Play, Plus } from "lucide-react";
import type { Mine, SegmentKey, SpezialKey, Spielstand, Wurm } from "./types";
import { SEGMENTE, baukosten } from "./config/segmente";
import { levelConfig } from "./config/level";
import { belohnungFuerLevel } from "./config/belohnungen";
import { Baum } from "./components/Baum";
import { WurmAnzeige } from "./components/WurmAnzeige";
import { WurmBauer } from "./components/WurmBauer";
import { SpezialButtons } from "./components/SpezialButtons";
import { EndBildschirm } from "./components/EndBildschirm";
import { PauseMenu } from "./components/PauseMenu";
import { Sternanis } from "./Sternanis";
import { lebenSumme, schadenAnWurm, wurmGeschwindigkeit } from "./utils/wurmBerechnung";
import { baueWurm, kiZufallswurm } from "./logik/wurmFabrik";

interface Props {
  stand: Spielstand;
  setStand: (s: Spielstand) => void;
  level: number;
  beenden: () => void;
}

const TICK = 50;
const BASIS_KANONEN_SCHADEN = 4;

export function Spielfeld({ stand, setStand, level, beenden }: Props) {
  const cfg = useMemo(() => levelConfig(level), [level]);
  const baumStufe = Math.max(
    1,
    Math.min(3, (stand.segmentStufen["panzer"] ?? 1)),
  );
  const baumReichweite = [8, 10, 12][baumStufe - 1];

  const [wuermer, setWuermer] = useState<Wurm[]>([]);
  const [minen, setMinen] = useState<Mine[]>([]);
  const [spielerHp, setSpielerHp] = useState(cfg.baumHp);
  const [feindHp, setFeindHp] = useState(cfg.baumHp);
  const [blatt, setBlatt] = useState(40);
  const [sternanisRunde, setSternanisRunde] = useState(0);
  const [eingesammelteAepfel, setEingesammelteAepfel] = useState(0);
  const [pausiert, setPausiert] = useState(false);
  const [bauerOffen, setBauerOffen] = useState(false);
  const [gewaehlteSegmente, setGewaehlteSegmente] = useState<SegmentKey[]>([]);
  const [ende, setEnde] = useState<{ sieg: boolean } | null>(null);
  const [spezialAktiv, setSpezialAktiv] = useState<{ taubeBis?: number; schildkroeteBis?: number }>({});
  const [cooldownBis, setCooldownBis] = useState<Record<SpezialKey, number>>({
    eichhoernchen: 0, taube: 0, schildkroete: 0,
  });
  const [vorrat, setVorrat] = useState<Record<SpezialKey, number>>({ ...stand.spezial });

  const letzteKiSpawn = useRef(0);
  const letzteBlattZeit = useRef(performance.now());
  const letzteBaseShoot = useRef({ spieler: 0, feind: 0 });

  // --- Spezialfähigkeit aktivieren -----------------------------------------
  const aktiviereSpezial = (k: SpezialKey) => {
    if ((vorrat[k] ?? 0) <= 0) return;
    setVorrat((v) => ({ ...v, [k]: v[k] - 1 }));
    setCooldownBis((c) => ({ ...c, [k]: performance.now() + 8000 }));
    if (k === "eichhoernchen") setBlatt((b) => b + 60);
    if (k === "taube") {
      const dauerMs = stand.admin.taubeMineDauer * 1000;
      // Bombardement über das gesamte Feld
      const neueMinen: Mine[] = [];
      const dichte = stand.admin.taubeMineDichte;
      const anzahl = Math.max(2, Math.round((cfg.feldBreite / 10) * dichte));
      for (let i = 0; i < anzahl; i++) {
        neueMinen.push({
          id: Math.random(),
          pos: 5 + Math.random() * (cfg.feldBreite - 10),
          pfad: Math.floor(Math.random() * 3),
          bisZeit: performance.now() + dauerMs,
        });
      }
      // Schaden über die ganze Fläche
      setWuermer((ws) => {
        for (const w of ws) if (w.seite === "feind") schadenAnWurm(w, 25);
        return [...ws];
      });
      setFeindHp((hp) => Math.max(0, hp - 30));
      setSpezialAktiv((s) => ({ ...s, taubeBis: performance.now() + 3000 }));
      setTimeout(() => setMinen((m) => [...m, ...neueMinen]), 3000);
    }
    if (k === "schildkroete") {
      const speed = stand.admin.schildkroeteSpeed;
      const ms = (cfg.feldBreite / Math.max(0.1, speed)) * 1000;
      setSpezialAktiv((s) => ({ ...s, schildkroeteBis: performance.now() + ms }));
    }
  };

  // --- Wurm losschicken -----------------------------------------------------
  const losschicken = () => {
    const kosten = gewaehlteSegmente.reduce(
      (acc, k) => {
        const stufe = stand.segmentStufen[k] ?? 1;
        const ko = baukosten(k, stufe);
        return { blatt: acc.blatt + ko.blatt, sternanis: acc.sternanis + ko.sternanis };
      },
      { blatt: 0, sternanis: 0 },
    );
    if (blatt < kosten.blatt || sternanisRunde < kosten.sternanis) return;
    setBlatt((b) => b - kosten.blatt);
    setSternanisRunde((s) => s - kosten.sternanis);
    const pfad = Math.floor(Math.random() * 3);
    const w = baueWurm("spieler", gewaehlteSegmente, stand, 3, pfad);
    setWuermer((ws) => [...ws, w]);
    setGewaehlteSegmente([]);
    setBauerOffen(false);
  };

  // --- Game Loop ------------------------------------------------------------
  useEffect(() => {
    if (ende || pausiert) return;
    const iv = setInterval(() => {
      const jetzt = performance.now();

      // Blätter generieren
      if (jetzt - letzteBlattZeit.current > 1000) {
        setBlatt((b) => Math.min(999, b + 5));
        if (Math.random() < 0.08) setSternanisRunde((s) => s + 1);
        letzteBlattZeit.current = jetzt;
      }

      // KI Spawn
      if (jetzt - letzteKiSpawn.current > cfg.kiSpawnIntervall) {
        letzteKiSpawn.current = jetzt;
        setWuermer((ws) => [
          ...ws,
          kiZufallswurm(
            cfg.kiSegmentAuswahl,
            cfg.kiStufe,
            stand,
            cfg.feldBreite - 3,
            Math.floor(Math.random() * 3),
          ),
        ]);
      }

      setWuermer((aktuelle) => {
        const ws = aktuelle.filter((w) => w.lebend);
        // Tote rausnehmen geschieht oben; ein Tick später entfernt
        const dt = TICK / 1000;

        // Bewegung
        for (const w of ws) {
          if (w.langsamBis < jetzt) w.langsamFaktor = 1;
          // Schildkröte slow auf Feinde
          if (
            w.seite === "feind" &&
            (spezialAktiv.schildkroeteBis ?? 0) > jetzt
          ) {
            w.langsamFaktor = Math.min(w.langsamFaktor, 0.65);
            w.langsamBis = jetzt + 100;
          }
          const v = wurmGeschwindigkeit(w);
          const richtung = w.seite === "spieler" ? 1 : -1;

          // Kollisionsprüfung: blockiert von gegnerischem Wurm vor mir?
          const halb = w.segmente.length / 2;
          const meinKopf = w.pos;
          let blockiert = false;
          for (const o of ws) {
            if (o === w || o.seite === w.seite) continue;
            const oHalb = o.segmente.length / 2;
            const dist = (o.pos - meinKopf) * richtung;
            if (dist > 0 && dist < halb + oHalb + 0.5) {
              blockiert = true;
              break;
            }
          }

          if (!blockiert) {
            w.pos += v * dt * richtung;
          }
          w.pos = Math.max(2, Math.min(cfg.feldBreite - 2, w.pos));
        }

        // Minen
        if (minen.length > 0) {
          for (const m of minen) {
            for (const w of ws) {
              if (w.seite !== "feind") continue;
              if (Math.abs(w.pos - m.pos) < 1 && w.pfad === m.pfad) {
                schadenAnWurm(w, 18);
              }
            }
          }
        }

        // Angriffe der Würmer
        for (const w of ws) {
          const kopfX = w.pos;
          for (const s of w.segmente) {
            const def = SEGMENTE[s.key];
            if (def.waffe === "keine") continue;
            const last = w.letzterSchuss[s.key] ?? 0;
            if (jetzt - last < def.feuerCooldown) continue;
            // Ziel suchen
            const range = def.reichweite;
            let bestes: Wurm | undefined;
            let bestDist = Infinity;
            for (const o of ws) {
              if (o.seite === w.seite) continue;
              const dist = w.seite === "spieler" ? o.pos - kopfX : kopfX - o.pos;
              if (dist >= 0 && dist <= range && dist < bestDist) {
                bestes = o;
                bestDist = dist;
              }
            }
            // Biss-Standard immer aus Kopf, Reichweite 1
            if (!bestes && (def.waffe === "biss" || s === w.segmente[0])) {
              for (const o of ws) {
                if (o.seite === w.seite) continue;
                const dist = w.seite === "spieler" ? o.pos - kopfX : kopfX - o.pos;
                if (dist >= 0 && dist <= 1.2 && dist < bestDist) {
                  bestes = o;
                  bestDist = dist;
                }
              }
            }
            // Kastanie -> Mine am Segment
            if (def.waffe === "kastanie" && def.schaden[s.stufe - 1] > 0) {
              w.letzterSchuss[s.key] = jetzt;
              setMinen((mm) => [
                ...mm,
                {
                  id: Math.random(),
                  pos: w.pos,
                  pfad: w.pfad,
                  bisZeit: jetzt + 10000,
                },
              ]);
              continue;
            }
            if (!bestes) continue;
            w.letzterSchuss[s.key] = jetzt;
            const sch = def.schaden[s.stufe - 1];
            schadenAnWurm(bestes, sch);
            // Sondereffekte
            if (def.waffe === "honig") {
              bestes.langsamFaktor = Math.min(bestes.langsamFaktor, 0.4);
              bestes.langsamBis = jetzt + 6000;
            }
            if (def.waffe === "blase") {
              if (bestes.segmente.length <= w.segmente.length) {
                bestes.pos += (w.seite === "spieler" ? 3 : -3);
              }
            }
          }
        }

        // Würmer greifen den Baum an, wenn er in Reichweite ist
        for (const w of ws) {
          for (const s of w.segmente) {
            const def = SEGMENTE[s.key];
            if (def.schaden[s.stufe - 1] <= 0) continue;
            const last = w.letzterSchuss[("baum_" + s.key) as SegmentKey] ?? 0;
            if (jetzt - last < def.feuerCooldown) continue;
            const distZuBaum =
              w.seite === "spieler"
                ? cfg.feldBreite - 2 - w.pos
                : w.pos - 2;
            const reich = def.waffe === "biss" || def.reichweite === 0 ? 1.5 : def.reichweite;
            if (distZuBaum <= reich) {
              w.letzterSchuss[("baum_" + s.key) as SegmentKey] = jetzt;
              const sch = def.schaden[s.stufe - 1];
              if (w.seite === "spieler") setFeindHp((hp) => Math.max(0, hp - sch));
              else setSpielerHp((hp) => Math.max(0, hp - sch));
            }
          }
          // Standard-Biss am Kopf
          const distZuBaum = w.seite === "spieler" ? cfg.feldBreite - 2 - w.pos : w.pos - 2;
          if (distZuBaum <= 1.2) {
            const last = w.letzterSchuss["baum_biss" as SegmentKey] ?? 0;
            if (jetzt - last > 600) {
              w.letzterSchuss["baum_biss" as SegmentKey] = jetzt;
              if (w.seite === "spieler") setFeindHp((hp) => Math.max(0, hp - 3));
              else setSpielerHp((hp) => Math.max(0, hp - 3));
            }
          }
        }

        // Baum-Kanone
        const beschiesse = (seite: "spieler" | "feind") => {
          const k = letzteBaseShoot.current[seite];
          if (jetzt - k < 900) return;
          const eigenerX = seite === "spieler" ? 2 : cfg.feldBreite - 2;
          let bestes: Wurm | undefined;
          let bestDist = Infinity;
          for (const o of ws) {
            if (o.seite === seite) continue;
            const dist = Math.abs(o.pos - eigenerX);
            if (dist <= baumReichweite && dist < bestDist) {
              bestes = o; bestDist = dist;
            }
          }
          if (bestes) {
            letzteBaseShoot.current[seite] = jetzt;
            schadenAnWurm(bestes, BASIS_KANONEN_SCHADEN * baumStufe);
          }
        };
        beschiesse("spieler");
        beschiesse("feind");

        return [...ws];
      });

      // Minen verfallen
      setMinen((mm) => mm.filter((m) => m.bisZeit > jetzt));
    }, TICK);
    return () => clearInterval(iv);
  }, [ende, pausiert, cfg, stand, baumStufe, baumReichweite, minen.length, spezialAktiv.schildkroeteBis]);

  // Tote endgültig entfernen
  useEffect(() => {
    const t = setTimeout(() => {
      setWuermer((ws) => ws.filter((w) => w.lebend));
    }, 600);
    return () => clearTimeout(t);
  }, [wuermer]);

  // Sieg / Niederlage
  useEffect(() => {
    if (ende) return;
    if (feindHp <= 0) setEnde({ sieg: true });
    else if (spielerHp <= 0) setEnde({ sieg: false });
  }, [feindHp, spielerHp, ende]);

  const fertig = (sieg: boolean) => {
    const belohnung = belohnungFuerLevel(level);
    let apfel = 0;
    let sternanis = 0;
    if (sieg) {
      apfel = belohnung.apfelBasis + eingesammelteAepfel * belohnung.apfelProAufgesammeltem;
      sternanis = (belohnung.sternanis ?? 0) + sternanisRunde;
    }
    const neuStand: Spielstand = {
      ...stand,
      apfel: stand.apfel + apfel,
      sternanis: stand.sternanis + sternanis,
      siege: stand.siege + (sieg ? 1 : 0),
      niederlagen: stand.niederlagen + (sieg ? 0 : 1),
      hoechstesLevel: sieg ? Math.max(stand.hoechstesLevel, level + 1) : stand.hoechstesLevel,
      spezial: vorrat,
    };
    if (sieg && belohnung.freischaltSegment) {
      const aktuelle = neuStand.segmentStufen[belohnung.freischaltSegment] ?? 0;
      const ziel = Math.max(aktuelle, belohnung.freischaltSegmentStufe ?? 1);
      neuStand.segmentStufen = { ...neuStand.segmentStufen, [belohnung.freischaltSegment]: ziel };
    }
    if (sieg && belohnung.spezial) {
      neuStand.spezial = {
        ...neuStand.spezial,
        [belohnung.spezial.key]: (neuStand.spezial[belohnung.spezial.key] ?? 0) + belohnung.spezial.anzahl,
      };
    }
    setStand(neuStand);
    beenden();
  };

  // Render
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-300 to-emerald-200">
      {/* HUD */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-2 bg-emerald-950/90 px-2 py-1.5 text-white">
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <span>Lvl {level}</span>
          <span className="flex items-center gap-1"><Leaf className="h-3.5 w-3.5 text-emerald-300" /> {blatt}</span>
          <span className="flex items-center gap-1"><Apple className="h-3.5 w-3.5 text-red-400" /> {eingesammelteAepfel}</span>
          <span className="flex items-center gap-1"><Sternanis className="h-3.5 w-3.5" /> {sternanisRunde}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBauerOffen(true)}
            className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs font-bold hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" /> Wurm
          </button>
          <button
            onClick={() => setPausiert((p) => !p)}
            className="rounded bg-slate-600 p-1.5 hover:bg-slate-500"
          >
            {pausiert ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Spielfeld */}
      <div className="relative h-[70vh] w-full">
        {/* Pfade */}
        {[0, 1, 2].map((p) => (
          <div
            key={p}
            className="absolute left-0 right-0 border-b border-emerald-700/30"
            style={{ bottom: `${30 + p * 56}px` }}
          />
        ))}

        <Baum seite="links" name={stand.name} farbe="emerald" hp={spielerHp} hpMax={cfg.baumHp} />
        <Baum seite="rechts" name={`KI L${level}`} farbe="rose" hp={feindHp} hpMax={cfg.baumHp} />

        {/* Spezialbuttons über eigenem Baum */}
        <SpezialButtons
          vorrat={vorrat}
          cooldownBis={cooldownBis}
          jetzt={performance.now()}
          aktivieren={aktiviereSpezial}
        />

        {/* Würmer */}
        {wuermer.map((w) => (
          <WurmAnzeige key={w.id} wurm={w} feldBreite={cfg.feldBreite} />
        ))}

        {/* Minen */}
        {minen.map((m) => (
          <div
            key={m.id}
            className="absolute h-3 w-3 rounded-full bg-red-700 ring-2 ring-red-300"
            style={{
              left: `${(m.pos / cfg.feldBreite) * 100}%`,
              bottom: `${20 + m.pfad * 56}px`,
              transform: "translateX(-50%)",
            }}
          />
        ))}

        {/* Taube Schatten */}
        {(spezialAktiv.taubeBis ?? 0) > performance.now() && (
          <div className="pointer-events-none absolute inset-x-0 top-1/3 flex animate-[fly_3s_linear_forwards]">
            <div className="text-4xl">🕊️</div>
          </div>
        )}
        {/* Schildkröte */}
        {(spezialAktiv.schildkroeteBis ?? 0) > performance.now() && (
          <div className="pointer-events-none absolute bottom-2 left-0 text-3xl">🐢</div>
        )}
      </div>

      {bauerOffen && (
        <WurmBauer
          loadout={stand.loadout}
          stand={stand}
          blatt={blatt}
          sternanisRunde={sternanisRunde}
          gewaehlt={gewaehlteSegmente}
          setGewaehlt={setGewaehlteSegmente}
          losschicken={losschicken}
          schliessen={() => setBauerOffen(false)}
        />
      )}

      {pausiert && !ende && (
        <PauseMenu weiter={() => setPausiert(false)} beenden={() => fertig(false)} />
      )}

      {ende && (
        <EndBildschirm
          sieg={ende.sieg}
          level={level}
          belohnungText={
            ende.sieg
              ? belohnungFuerLevel(level).text ?? "Sauber gespielt!"
              : "Versuch's nochmal."
          }
          apfel={
            ende.sieg
              ? belohnungFuerLevel(level).apfelBasis +
                eingesammelteAepfel * belohnungFuerLevel(level).apfelProAufgesammeltem
              : 0
          }
          sternanis={ende.sieg ? (belohnungFuerLevel(level).sternanis ?? 0) + sternanisRunde : 0}
          weiter={() => fertig(ende.sieg)}
        />
      )}

      {/* Sammelbarer Apfel: einfache Klick-Mechanik */}
      <ApfelSammler addApfel={() => setEingesammelteAepfel((n) => n + 1)} />
    </div>
  );
}

function ApfelSammler({ addApfel }: { addApfel: () => void }) {
  const [pos, setPos] = useState<{ x: number; y: number; id: number } | null>(null);
  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() < 0.6) {
        setPos({ x: 10 + Math.random() * 80, y: 30 + Math.random() * 40, id: Math.random() });
      }
    }, 5000);
    return () => clearInterval(iv);
  }, []);
  if (!pos) return null;
  return (
    <button
      key={pos.id}
      onClick={() => {
        addApfel();
        setPos(null);
      }}
      className="absolute z-30 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 p-2 shadow-lg ring-2 ring-red-900 hover:scale-110"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      aria-label="Apfel einsammeln"
    >
      <Apple className="h-4 w-4 text-white" />
    </button>
  );
}

// Verstummen Voraussetzung damit ESLint nicht meckert (unbenutzte Imports)
void Pause; void Play; void lebenSumme;

export default Spielfeld;
