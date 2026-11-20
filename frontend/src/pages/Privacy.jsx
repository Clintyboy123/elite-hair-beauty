import PageHero from '../components/sections/PageHero';
import Reveal from '../components/Reveal';
import useSeo from '../hooks/useSeo';
import { site } from '../content/site';

const sections = [
  {
    title: 'What we collect',
    body: [
      'When you send a message, a wedding enquiry or sign up for our newsletter, we keep the details you type into the form: your name, email address, contact number and what you tell us. We don’t collect anything else through these forms.',
      'Online bookings are made on Fresha and shop orders on our online store; their own privacy terms apply to the details you give there.',
    ],
  },
  {
    title: 'How we use it',
    body: [
      'Only to reply to you, to plan your appointment or wedding, and (if you asked for it) to send you our newsletter. We never sell or share your details for anyone else’s marketing.',
    ],
  },
  {
    title: 'Your choices',
    body: [
      `You can ask us at any time what we hold about you, to correct it, or to delete it, and you can unsubscribe from the newsletter whenever you like. Email ${site.email} or call ${site.phone}.`,
    ],
  },
];

export default function Privacy() {
  useSeo({ title: 'Privacy', description: 'How Elite Hair & Beauty handles the personal details you share through this website.', path: '/privacy' });
  return (
    <>
      <PageHero variant="light" eyebrow="Your details" title={['PRIVACY']} label="Privacy" intro="How we look after the details you share with us through this website." />
      <section className="bg-white py-section">
        <div className="shell mx-auto flex max-w-3xl flex-col gap-14">
          {sections.map((s) => (
            <Reveal key={s.title} className="flex flex-col gap-4 border-t border-line-light pt-8">
              <h2 className="statement text-h3 text-cherry">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p} className="text-muted">
                  {p}
                </p>
              ))}
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
