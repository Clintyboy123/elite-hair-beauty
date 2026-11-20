import { Star } from 'lucide-react';

export default function Stars({ className = 'text-rose', size = 'size-3.5' }) {
  return (
    <span className={`inline-flex gap-1 ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={`${size} fill-current`} strokeWidth={0} />
      ))}
    </span>
  );
}
