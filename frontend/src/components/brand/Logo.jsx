// The Elite Hair & Beauty wordmark, redrawn as a vector from the salon's logo so it stays crisp at any size and
// takes any brand colour (it uses currentColor). The original's thick stems and hairline arms, the E–H join,
// the open "Λ" A and the ruled "& BEAUTY" line are kept; hairlines are drawn a touch heavier than the original
// so they survive small sizes on screen.
//   <Logo className="h-10 w-auto text-ivory" />
const HAIR = 1.5; // hairline weight in logo units (the logo is 270 x 74)

export default function Logo({ className = '', title = 'Elite Hair & Beauty', showTagline = true }) {
  const h = (x, y, w) => <rect x={x} y={y - HAIR / 2} width={w} height={HAIR} />;
  return (
    <svg viewBox={`0 0 270 ${showTagline ? 74 : 57}`} className={className} fill="currentColor" role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      {/* top rule */}
      {h(0, 1, 270)}
      {/* E */}
      <rect x="0" y="10" width="6" height="46" />
      {h(0, 10.7, 29)}
      {h(0, 31.5, 27)}
      {h(0, 55.3, 29)}
      {/* L */}
      <rect x="37" y="10" width="5" height="46" />
      {h(37, 55.3, 26)}
      {/* I */}
      <rect x="68" y="10" width="6" height="46" />
      {/* T */}
      {h(79, 10.7, 32)}
      <rect x="92" y="10" width="5" height="46" />
      {/* E */}
      <rect x="115" y="10" width="6" height="46" />
      {h(115, 10.7, 29)}
      {h(115, 31.8, 28)}
      {h(116, 55.3, 28)}
      {/* H, sharing its bar with the E */}
      {h(149, 31.8, 29)}
      <rect x="172" y="10" width="6" height="46" />
      {/* A: open, no crossbar - a hairline and a heavy diagonal */}
      <polygon points={`201.4,10 ${201.4 + HAIR},10 ${185 + HAIR},56 185,56`} />
      <polygon points="200.4,10 204.4,10 221,56 214.6,56" />
      {/* I */}
      <rect x="226" y="10" width="6" height="46" />
      {/* R */}
      <rect x="239" y="10" width="6" height="46" />
      <path
        fillRule="evenodd"
        d={`M239 10 H257.5 C265.5 10 270 14.6 270 20.8 C270 27 265.5 32.5 257.5 32.5 H239 Z M244 ${10 + HAIR} H256.5 C261.6 ${10 + HAIR} 264.4 15.2 264.4 20.8 C264.4 26.4 261.6 ${32.5 - HAIR} 256.5 ${32.5 - HAIR} H244 Z`}
      />
      <polygon points="248.4,32 255.2,32 269,56 262.2,56" />
      {showTagline && (
        <>
          {h(0, 65.6, 86)}
          {h(182, 65.6, 88)}
          <text x="134" y="72.6" textAnchor="middle" fontFamily="'DM Sans Variable', ui-sans-serif, sans-serif" fontSize="12.6" fontWeight="300" letterSpacing="2.4">
            &amp; BEAUTY
          </text>
        </>
      )}
    </svg>
  );
}
