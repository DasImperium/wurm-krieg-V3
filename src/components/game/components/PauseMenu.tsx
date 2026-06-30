interface PauseMenuProps {
  weiter: () => void;
  beenden: () => void;
}

export function PauseMenu({ weiter, beenden }: PauseMenuProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="rounded-2xl bg-slate-800 p-8 text-center shadow-2xl ring-1 ring-white/10">
        <h2 className="text-2xl font-extrabold text-white">Pause</h2>
        <p className="mt-2 text-slate-300">Das Spiel ist angehalten.</p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={weiter}
            className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-500"
          >
            Weiter spielen
          </button>
          <button
            type="button"
            onClick={beenden}
            className="rounded-xl bg-rose-700 px-6 py-3 font-bold text-white hover:bg-rose-600"
          >
            Schlacht aufgeben
          </button>
        </div>
      </div>
    </div>
  );
}
