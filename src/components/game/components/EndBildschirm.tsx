import { Trophy, X } from "lucide-react";

interface EndBildschirmProps {
  sieg: boolean;
  level: number;
  belohnungText: string;
  apfel: number;
  sternanis: number;
  weiter: () => void;
}

export function EndBildschirm({ sieg, level, belohnungText, apfel, sternanis, weiter }: EndBildschirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div
        className={`max-w-md rounded-2xl p-8 text-center shadow-2xl ${
          sieg ? "bg-gradient-to-br from-emerald-300 to-emerald-500" : "bg-gradient-to-br from-rose-300 to-rose-500"
        }`}
      >
        {sieg ? <Trophy className="mx-auto mb-3 h-16 w-16 text-emerald-950" /> : <X className="mx-auto mb-3 h-16 w-16 text-rose-950" />}
        <h2 className="text-3xl font-extrabold text-emerald-950">
          {sieg ? `Level ${level} geschafft!` : `Level ${level} verloren`}
        </h2>
        <p className="mt-3 text-emerald-950 whitespace-pre-line">{belohnungText}</p>
        {sieg && (
          <p className="mt-2 text-emerald-950 font-bold">
            +{apfel} Äpfel{sternanis > 0 ? `, +${sternanis} Sternanis` : ""}
          </p>
        )}
        <button
          type="button"
          onClick={weiter}
          className="mt-6 rounded-xl bg-emerald-950 px-6 py-3 text-base font-bold text-white hover:bg-emerald-800"
        >
          Weiter
        </button>
      </div>
    </div>
  );
}
