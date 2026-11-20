// Instagram and Facebook marks (Lucide no longer ships brand icons). Line style to match Lucide at strokeWidth 1.25.
export default function SocialIcon({ id, className = 'size-5' }) {
  if (id === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className={className} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className={className} aria-hidden="true">
      <path d="M14.5 8.5h2.5V5h-2.5C12 5 10.5 6.7 10.5 9v2H8v3.5h2.5V21H14v-6.5h2.6l.4-3.5h-3V9.3c0-.5.3-.8.5-.8Z" strokeLinejoin="round" />
    </svg>
  );
}
