import { ArrowLeft } from "lucide-react";

interface Props {
  zurueck: () => void;
}

export function Ueberfall({ zurueck }: Props) {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl bg-slate-800 p-6 ring-1 ring-white/10 text-center">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={zurueck} className="rounded bg-slate-700 px-3 py-2 text-sm font-bold hover:bg-slate-600">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-2xl font-extrabold">Überfall</h1>
        <div />
      </div>
      <p className="text-slate-300">Mini-Spiel kommt im nächsten Update.</p>
    </div>
  );
}

export default Ueberfall;
