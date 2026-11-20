import { Link } from 'react-router';
import { ArrowRight, LoaderCircle } from 'lucide-react';

// Buttons. Pick the variant for the ground it sits on:
//   light grounds: burgundy (primary), outline (secondary)
//   dark grounds:  ivory (primary), outline-light (secondary)
// `to` makes it a router link, `href` an external/phone/mail link, otherwise a <button>.
// `arrow` adds the sliding arrow used on booking calls to action.
const variants = {
  burgundy: 'btn-burgundy',
  outline: 'btn-outline',
  ivory: 'btn-ivory',
  'outline-light': 'btn-outline-light',
};

export default function Button({ variant = 'burgundy', size, to, href, arrow = false, loading = false, disabled = false, className = '', children, ...props }) {
  const classes = `btn ${variants[variant]} ${size === 'sm' ? 'btn-sm' : ''} ${className}`;
  const content = (
    <>
      {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
      <span>{children}</span>
      {arrow && <ArrowRight className="btn-arrow size-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    // Outbound links open in a new tab, except where the caller keeps the visitor on the same tab (target="_self",
    // e.g. handing over to the shop's basket and checkout).
    const external = /^https?:/.test(href) && props.target !== '_self';
    return (
      <a href={href} className={classes} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>
        {content}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <button type="button" {...props} className={classes} disabled={loading || disabled} aria-busy={loading || undefined}>
      {content}
    </button>
  );
}
