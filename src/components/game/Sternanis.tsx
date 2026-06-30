import { Star } from "lucide-react";

export function Sternanis({ className = "h-4 w-4" }: { className?: string }) {
  return <Star className={`${className} fill-yellow-300 stroke-yellow-700`} />;
}

export default Sternanis;
