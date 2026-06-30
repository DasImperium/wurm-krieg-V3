import { useState } from "react";
import { useSpielstand, resetSpielstand } from "./components/game/state/spielstand";
import Hauptmenue from "./components/game/Hauptmenue";
import Spielfeld from "./components/game/Spielfeld";
import AdminPanel from "./components/game/AdminPanel";
import Ueberfall from "./components/game/Ueberfall";
import Forschung from "./components/game/screens/Forschung";
import LevelAuswahl from "./components/game/screens/LevelAuswahl";
import LoadoutAuswahl from "./components/game/screens/LoadoutAuswahl";
import Anleitung from "./components/game/screens/Anleitung";

type Ansicht =
  | "menu"
  | "forschung"
  | "level"
  | "loadout"
  | "game"
  | "anleitung"
  | "minigame"
  | "admin";

export default function App() {
  const [stand, setStand] = useSpielstand();
  const [ansicht, setAnsicht] = useState<Ansicht>("menu");
  const [aktivesLevel, setAktivesLevel] = useState(1);

  return (
    <div className="min-h-screen w-full bg-slate-900 p-4 text-white">
      {ansicht === "menu" && (
        <Hauptmenue
          stand={stand}
          setStand={setStand}
          zuLevel={() => setAnsicht("level")}
          zuForschung={() => setAnsicht("forschung")}
          zuAnleitung={() => setAnsicht("anleitung")}
          zuMinigame={() => setAnsicht("minigame")}
          zuAdmin={() => setAnsicht("admin")}
          reset={() => setStand(resetSpielstand())}
        />
      )}

      {ansicht === "forschung" && (
        <Forschung stand={stand} setStand={setStand} zurueck={() => setAnsicht("menu")} />
      )}

      {ansicht === "level" && (
        <LevelAuswahl
          stand={stand}
          start={(lvl) => { setAktivesLevel(lvl); setAnsicht("loadout"); }}
          zurueck={() => setAnsicht("menu")}
        />
      )}

      {ansicht === "loadout" && (
        <LoadoutAuswahl
          stand={stand}
          setStand={setStand}
          weiter={() => setAnsicht("game")}
          zurueck={() => setAnsicht("level")}
        />
      )}

      {ansicht === "game" && (
        <Spielfeld
          stand={stand}
          setStand={setStand}
          level={aktivesLevel}
          beenden={() => setAnsicht("menu")}
        />
      )}

      {ansicht === "anleitung" && <Anleitung zurueck={() => setAnsicht("menu")} />}
      {ansicht === "minigame" && <Ueberfall zurueck={() => setAnsicht("menu")} />}
      {ansicht === "admin" && <AdminPanel stand={stand} setStand={setStand} zurueck={() => setAnsicht("menu")} />}
    </div>
  );
}
