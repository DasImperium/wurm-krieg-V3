import { ArrowLeft } from "lucide-react";

interface Props {
  zurueck: () => void;
}

export function Anleitung({ zurueck }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={zurueck} className="flex items-center gap-1 rounded bg-slate-700 px-3 py-2 text-sm font-bold hover:bg-slate-600">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </button>
        <h1 className="text-2xl font-extrabold">Anleitung</h1>
        <div />
      </div>
      <div className="space-y-3 rounded-lg bg-slate-800 p-4 text-sm leading-relaxed">
        <p><b>Ziel:</b> Zerstöre den Baum des Gegners mit deinen Würmern, bevor er deinen Baum zerstört.</p>
        <p><b>Würmer:</b> Jeder Wurm besteht aus 1–6 Segmenten. Das Leben ist die Summe aller Segment-HP. Erst wenn die Gesamt-HP 0 ist, stirbt der Wurm.</p>
        <p><b>Loadout:</b> Vor jeder Schlacht wählst du 1–8 verschiedene Segmente, die du dann im Spiel zum Bau einsetzen kannst.</p>
        <p><b>Waffenreichweiten (in Segmenten):</b> Biss 1 · Schall 3 · Laser 6 · Kastanie 0 · Raketenwerfer 10 · Granatwerfer 4 · Stachel 3 · Honig 4 · Blase 3 · Flamme 2.</p>
        <p><b>Basis-Verteidigung:</b> Stufe 1 = 8 Segmente · Stufe 2 = 10 · Stufe 3 = 12.</p>
        <p><b>Geschwindigkeit:</b> Alle Segmente außer <i>Beine</i> machen den Wurm langsamer.</p>
        <p><b>Spezialfähigkeiten:</b> Über den Buttons über deinem Baum aktivierbar – Eichhörnchen (Blätter auffüllen), Taube (Bombardement + 6 s Minen), Schildkröte (Slow 35 % auf feindliche Würmer).</p>
        <p><b>Forschung:</b> Schaltet weitere Segmente frei (außer Beine, MG, Panzer) und steigert deren Stufe bis 5. Ab Stufe 4 kosten sie zusätzlich Sternanis.</p>
        <p><b>Pause:</b> Während einer Schlacht oben rechts pausieren / fortsetzen.</p>
      </div>
    </div>
  );
}

export default Anleitung;
