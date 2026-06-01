import { cn } from "@/lib/utils";

/**
 * Logo PrésiFrance : arc présidentiel stylisé.
 * Évoque l'architecture institutionnelle (Élysée, monuments républicains).
 */
export default function PresiFranceLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      aria-hidden
    >
      {/* Portique : colonnes + arc en plein cintre */}
      <rect x="5" y="12" width="5" height="16" rx="1" fill="currentColor" fillOpacity="0.9" />
      <rect x="22" y="12" width="5" height="16" rx="1" fill="currentColor" fillOpacity="0.9" />
      {/* Arc en plein cintre */}
      <path
        d="M10 12 Q16 2 22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
