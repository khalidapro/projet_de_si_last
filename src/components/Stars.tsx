import { Star } from "lucide-react";

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`Rating ${rating} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="absolute inset-0 text-primary/30" style={{ width: size, height: size }} strokeWidth={1.6} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star
                className="text-primary fill-primary"
                style={{ width: size, height: size }}
                strokeWidth={1.6}
              />
            </span>
          </span>
        );
      })}
    </div>
  );
}
