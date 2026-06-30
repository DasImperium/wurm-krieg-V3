import {
  Bug,
  Crosshair,
  Flame,
  Footprints,
  Leaf,
  Radio,
  Rocket,
  Shield,
  Skull,
  Sparkles,
  Squirrel,
  Target,
  Wind,
  Zap,
  Cookie,
  Bird,
  Droplet,
  type LucideIcon,
} from "lucide-react";
import type { SegmentKey, SpezialKey } from "../types";

// Turtle ist nicht in jeder lucide-react Version vorhanden.
import * as Lucide from "lucide-react";
const Turtle: LucideIcon =
  ((Lucide as unknown as Record<string, LucideIcon>).Turtle ?? Shield) as LucideIcon;

export const SEGMENT_ICON: Record<SegmentKey, LucideIcon> = {
  beine: Footprints,
  mg: Crosshair,
  panzer: Shield,
  kettenhemd: Shield,
  schall: Radio,
  laser: Zap,
  kastanie: Cookie,
  raketenwerfer: Rocket,
  gatling: Target,
  granatwerfer: Bug,
  stachel: Sparkles,
  spinnenest: Bug,
  honigpumpe: Droplet,
  blasebalg: Wind,
  larven: Skull,
  flammenwerfer: Flame,
};

export const SPEZIAL_ICON: Record<SpezialKey, LucideIcon> = {
  eichhoernchen: Squirrel,
  taube: Bird,
  schildkroete: Turtle,
};

export { Leaf };
