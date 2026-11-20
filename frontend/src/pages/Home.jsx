import HomeHero from '../components/sections/HomeHero';
import BrandIntro from '../components/sections/BrandIntro';
import ServicesTriptych from '../components/sections/ServicesTriptych';
import Experience from '../components/sections/Experience';
import TeamStrip from '../components/sections/TeamStrip';
import GalleryShowcase from '../components/sections/GalleryShowcase';
import ClientLove from '../components/sections/ClientLove';
import FinalCta from '../components/sections/FinalCta';
import useSeo from '../hooks/useSeo';

export default function Home() {
  useSeo({
    description:
      'Elite Hair & Beauty is a modern hair and beauty salon at The1054, 254 Main Road, Walmer, Gqeberha: cuts, colour, balayage, Brazilian Blowouts, nails, lashes, facials, massage and bridal hair & make-up. Book online.',
    path: '/',
  });
  return (
    <>
      <HomeHero />
      <BrandIntro />
      <ServicesTriptych />
      <Experience />
      <TeamStrip />
      <GalleryShowcase />
      <ClientLove />
      <FinalCta />
    </>
  );
}
