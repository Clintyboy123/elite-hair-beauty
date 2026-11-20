import Field from './Field';
import FormStatus from './FormStatus';
import FormSuccess from './FormSuccess';
import Honeypot from './Honeypot';
import useForm from './useForm';
import Button from '../ui/Button';
import { sendEnquiry } from '../../services/forms';
import { enquirySubjects } from '../../content/site';

const initial = { name: '', email: '', phone: '', subject: enquirySubjects[0], message: '', website: '' };

export default function ContactForm({ tone = 'light' }) {
  const form = useForm(initial, sendEnquiry);

  if (form.status === 'sent') {
    return (
      <FormSuccess tone={tone} title="Thank you. Your message is with us." onReset={form.reset} resetLabel="Send another message">
        <p>We’ll reply as soon as we can. Your reference is #{form.result?.data?.reference}.</p>
        <p>Need us sooner? Call 041 581 0090 during opening hours.</p>
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={form.submit} noValidate className="relative grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2" aria-label="Contact form">
      <Field tone={tone} label="Your name" required autoComplete="name" {...form.field('name')} className="sm:col-span-2" />
      <Field tone={tone} label="Email" type="email" required autoComplete="email" {...form.field('email')} />
      <Field tone={tone} label="Contact number" type="tel" autoComplete="tel" {...form.field('phone')} />
      <Field tone={tone} label="What is it about?" as="select" required {...form.field('subject')} className="sm:col-span-2">
        {enquirySubjects.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Field>
      <Field tone={tone} label="Message" as="textarea" rows={5} required {...form.field('message')} className="sm:col-span-2" />
      <Honeypot value={form.values.website} onChange={(e) => form.set('website', e.target.value)} />
      <div className="flex flex-col items-center gap-4 sm:col-span-2 sm:flex-row">
        <Button type="submit" variant={tone === 'dark' ? 'ivory' : 'burgundy'} arrow loading={form.status === 'sending'} className="w-full sm:w-auto">
          {form.status === 'sending' ? 'Sending…' : 'Send message'}
        </Button>
        <FormStatus status={form.status} message={form.message} tone={tone} />
      </div>
      <p className={`text-[0.8125rem] sm:col-span-2 ${tone === 'dark' ? 'text-mist' : 'text-muted'}`}>
        To book an appointment, please use online booking: it shows live availability for every stylist.
      </p>
    </form>
  );
}
