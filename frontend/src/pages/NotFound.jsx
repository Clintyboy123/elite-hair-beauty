import { motion } from 'motion/react';
import Button from '../components/ui/Button';
import TextLink from '../components/ui/TextLink';
import SplitHeading from '../components/ui/SplitHeading';
import useSeo from '../hooks/useSeo';
import { booking } from '../content/site';
import { ease } from '../utils/motion';

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'This page could not be found.', path: '/' });
  return (
    <section className="grain flex min-h-[100svh] items-center bg-cherry text-ivory">
      <div className="shell flex flex-col items-center gap-stack pt-24 text-center">
        <p className="label text-blush">Error 404</p>
        <SplitHeading as="h1" play label="This look doesn’t exist." parts={[{ text: 'THIS LOOK', break: true }, { text: 'DOESN’T eXIST.' }]} className="display text-h1" />
        <motion.p className="max-w-md text-lead text-ivory/80" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { duration: 4, ease, delay: 0.8 } }}>
          The page you’re looking for has moved or never existed. Let’s get you somewhere beautiful.
        </motion.p>
        <motion.div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { duration: 4, ease, delay: 1.1 } }}>
          <Button to="/" variant="ivory" arrow>
            Back to home
          </Button>
          <TextLink to="/book" className="text-ivory">
            Book an appointment
          </TextLink>
        </motion.div>
      </div>
    </section>
  );
}
