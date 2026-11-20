import { useId } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, LoaderCircle } from 'lucide-react';
import Honeypot from './Honeypot';
import useForm from './useForm';
import { subscribe } from '../../services/forms';
import { ease } from '../../utils/motion';

// Footer newsletter sign-up (the current site's "Subscribe to our newsletter").
export default function NewsletterForm() {
  const id = useId();
  const form = useForm({ email: '', website: '' }, (v) => subscribe({ ...v, source: 'newsletter' }));
  const error = form.errors.email || (form.status === 'error' ? form.message : '');

  return (
    <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
      <h2 className="label text-blush">Subscribe to our newsletter</h2>
      <p className="max-w-[34ch] text-small text-mist">Be the first to know about amazing promos on services and products.</p>
      <AnimatePresence mode="wait" initial={false}>
        {form.status === 'sent' ? (
          <motion.p
            key="done"
            role="status"
            className="flex min-h-14 items-center gap-3 text-ivory"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1.2, ease } }}
          >
            <Check className="size-4 text-blush" strokeWidth={1.5} aria-hidden="true" /> {form.message}
          </motion.p>
        ) : (
          <motion.form key="form" onSubmit={form.submit} noValidate className="relative w-full max-w-md" exit={{ opacity: 0, transition: { duration: 0.4 } }} aria-label="Newsletter sign-up">
            <label htmlFor={id} className="sr-only">
              Email address
            </label>
            <div className={`flex items-center border-b transition-colors duration-500 ${error ? 'border-danger-light' : 'border-ivory/30 focus-within:border-blush hover:border-ivory/60'}`}>
              <input
                id={id}
                type="email"
                autoComplete="email"
                placeholder="Your email address"
                {...form.field('email')}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className="min-h-14 flex-1 bg-transparent text-body text-ivory outline-none placeholder:text-ivory/45"
              />
              <button type="submit" className="flex size-12 items-center justify-center text-ivory transition-colors duration-700 hover:text-blush" aria-label="Subscribe" disabled={form.status === 'sending'}>
                {form.status === 'sending' ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="size-5" strokeWidth={1.25} aria-hidden="true" />}
              </button>
            </div>
            <Honeypot value={form.values.website} onChange={(e) => form.set('website', e.target.value)} />
            {error && (
              <p id={`${id}-error`} role="alert" className="mt-2 text-[0.8125rem] text-danger-light">
                {error}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
