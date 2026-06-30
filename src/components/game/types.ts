// Zentrale Typen für Wurmkrieg2.
export type SegmentKey =
  | "beine"
  | "mg"
  | "panzer"
  | "kettenhemd"
  | "schall"
  | "laser"
  | "kastanie"
  | "raketenwerfer"
  | "gatling"
  | "granatwerfer"
  | "stachel"
  | "spinnenest"
  | "honigpumpe"
  | "blasebalg"
  | "larven"
  | "flammenwerfer";

export type WaffenTyp =
  | "biss"
  | "mg"
  | "schall"
  | "laser"
  | "kastanie"
  | "raketenwerfer"
  | "gatling"
  | "granat"
  | "stachel"
  | "honig"
  | "blase"
  | "flamme"
  | "spinne"
  | "larven"
  | "keine";

export interface SegmentDef {
  key: SegmentKey;
  name: string;
  beschreibung: string;
  /** Tailwind Hintergrundklasse */
  farbe: string;
  /** Basis-Freischaltkosten (Stufe 1) */
  freischaltApfel: number;
  freischaltSternanis: number;
  /** Multiplikator für jede weitere Stufe (drastisch steigend) */
  forschungSteigerung: number;
  /** Kosten in Blättern beim Bau eines Wurms (= Äpfelkosten) */
  blattKosten: number;
  /** Sternanis-Kosten ab Stufe 4 (0 falls keine) */
  sternanisBauAb4: number;
  /** HP pro Stufe 1..5 */
  hp: number[];
  /** Schaden pro Stufe 1..5 (Schaden pro Treffer) */
  schaden: number[];
  /** Geschwindigkeitsmultiplikator pro Stück (0.92 = -8%). Beine > 1 = schneller. */
  speedFaktor: number;
  waffe: WaffenTyp;
  /** Reichweite in Segmenten */
  reichweite: number;
  /** Schussintervall in ms */
  feuerCooldown: number;
  /** Standardmäßig freigeschaltet (Beine, MG, Panzer) */
  basis?: boolean;
}

export interface SegmentInstanz {
  key: SegmentKey;
  stufe: number;
  hp: number;
  hpMax: number;
}

export interface Wurm {
  id: number;
  seite: "spieler" | "feind";
  pfad: number; // Spur (0..2)
  pos: number; // Position in Segmenten
  segmente: SegmentInstanz[];
  lebend: boolean;
  sterbend: boolean;
  flashBis: number;
  langsamBis: number; // Slow-Effekt bis Zeitpunkt
  langsamFaktor: number;
  letzterSchuss: Partial<Record<SegmentKey, number>>;
  brennenBis?: number;
  giftBis?: number;
  kettenhemdReduktion?: number;
}

export interface Mine {
  id: number;
  pos: number;
  pfad: number;
  bisZeit: number;
}

export interface FallObjekt {
  id: number;
  /** Zielposition in Segmenten */
  zielPos: number;
  pfad: number;
  einschlagZeit: number;
  radius: number;
  schaden: number;
  art: "kastanie" | "granate" | "raketen" | "taube";
}

export type SpezialKey = "eichhoernchen" | "taube" | "schildkroete";

export interface SpezialDef {
  key: SpezialKey;
  name: string;
  beschreibung: string;
  freischaltApfel: number;
  freischaltSternanis: number;
  /** Steigerung pro gekauftem Exemplar (Forschung kauft Stück für Stück) */
  steigerung: number;
}

export interface Spielstand {
  name: string;
  apfel: number;
  sternanis: number;
  level: number; // aktuelles Level (1..100)
  hoechstesLevel: number;
  siege: number;
  niederlagen: number;
  /** Segment-Stufe: 0 = nicht freigeschaltet, 1..5 = Stufe */
  segmentStufen: Partial<Record<SegmentKey, number>>;
  /** Vorrat an Spezialfähigkeiten */
  spezial: Record<SpezialKey, number>;
  /** Voreingestelltes Loadout (1-8 Segmente) für die nächste Schlacht */
  loadout: SegmentKey[];
  /** Admin-Einstellungen */
  admin: {
    schildkroeteSpeed: number; // Segmente / Sekunde (0.1 - 5)
    taubeMineDichte: number; // 1..10 Minen pro 10 Segmente
    taubeMineDauer: number; // Sekunden
  };
}

export type Ansicht =
  | "menu"
  | "forschung"
  | "loadout"
  | "game"
  | "minigame"
  | "admin";
