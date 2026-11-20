import { Check } from 'lucide-react';
import Field from './Field';
import FormStatus from './FormStatus';
import FormSuccess from './FormSuccess';
import Honeypot from './Honeypot';
import useForm from './useForm';
import Button from '../ui/Button';
import { sendWeddingEnquiry } from '../../services/forms';
import { weddingServiceOptions } from '../../content/services';

const today = () => new Date(Date.now() + 2 * 3600 * 1000).toISOString().slice(0, 10);
const initial = { name: '', email: '', phone: '', weddingDate: '', venue: '', partySize: '', services: [], message: '', website: '' };

const validate = (v) => {
  const e = {};
  if (!v.services.length) e.services = 'Choose at least one service (or “Not sure yet”)';
  return e;
};

// Wedding enquiry: saved in the database and emailed to the salon when email is set up.
export default function WeddingForm() {
  const form = useForm(initial, sendWeddingEnquiry, { validate });
  const toggle = (option) => form.set('services', form.values.services.includes(option) ? form.values.services.filter((s) => s !== option) : [...form.values.services, option]);

  if (form.status === 'sent') {
    return (
      <FormSuccess title="Congratulations, and thank you." onReset={form.reset} resetLabel="Send another enquiry">
        <p>We have your wedding enquiry and will be in touch to talk through your look, your bridal party and your timings. Your reference is #{form.result?.data?.reference}.</p>
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={form.submit} noValidate className="relative grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2" aria-label="Wedding enquiry">
      <Field label="Your name" required autoComplete="name" {...form.field('name')} />
      <Field label="Email" type="email" required autoComplete="email" {...form.field('email')} />
      <Field label="Contact number" type="tel" required autoComplete="tel" {...form.field('phone')} />
      <Field label="Wedding date" type="date" required min={today()} {...form.field('weddingDate')} />
      <Field label="Where are you getting ready?" placeholder="Venue, town or home" hint="We’ll come to you." {...form.field('venue')} />
      <Field label="How many people need hair or make-up?" type="number" min="1" max="40" inputMode="numeric" {...form.field('partySize')} />

      <fieldset className="sm:col-span-2" aria-describedby={form.errors.services ? 'services-error' : undefined}>
        <legend className="label text-cherry">
          Services you’d like <span className="text-rose" aria-hidden="true">*</span>
        </legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {weddingServiceOptions.map((option) => {
            const on = form.values.services.includes(option);
            return (
              <label key={option} className={`chip ${on ? 'border-burgundy bg-burgundy text-white' : 'border-cherry/20 text-charcoal hover:border-burgundy/60'} has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-rose`}>
                <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(option)} />
                <span className={`flex size-4 items-center justify-center rounded-full border ${on ? 'border-white' : 'border-cherry/30'}`} aria-hidden="true">
                  {on && <Check className="size-3" strokeWidth={2} />}
                </span>
                {option}
              </label>
            );
          })}
        </div>
        {form.errors.services && (
          <p id="services-error" role="alert" className="mt-3 text-[0.8125rem] text-danger">
            {form.errors.services}
          </p>
        )}
      </fieldset>

      <Field label="Tell us about your day" as="textarea" rows={5} placeholder="Your style, the look you love, timings, anything we should know" {...form.field('message')} className="sm:col-span-2" />
      <Honeypot value={form.values.website} onChange={(e) => form.set('website', e.target.value)} />
      <div className="flex flex-col items-center gap-4 sm:col-span-2 sm:flex-row">
        <Button type="submit" arrow loading={form.status === 'sending'} className="w-full sm:w-auto">
          {form.status === 'sending' ? 'Sending…' : 'Send wedding enquiry'}
        </Button>
        <FormStatus status={form.status} message={form.message} />
      </div>
    </form>
  );
}
