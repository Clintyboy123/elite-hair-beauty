import { lazy, Suspense } from 'react';
import { MotionConfig } from 'motion/react';
import { Route, Routes, useLocation } from 'react-router';
import MainLayout from './layouts/MainLayout';
import { duration, ease } from './utils/motion';
import Home from './pages/Home';

// The home page ships in the main bundle; every other page loads on demand.
const About = lazy(() => import('./pages/About'));
const Hair = lazy(() => import('./pages/Hair'));
const Beauty = lazy(() => import('./pages/Beauty'));
const Weddings = lazy(() => import('./pages/Weddings'));
const Team = lazy(() => import('./pages/Team'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Shop = lazy(() => import('./pages/Shop'));
const Contact = lazy(() => import('./pages/Contact'));
const Book = lazy(() => import('./pages/Book'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  const location = useLocation();
  return (
    // reducedMotion="user": visitors who ask their device for less motion get fades without movement.
    // transition: anything that doesn't set its own timing uses the site's ease-out curve.
    <MotionConfig reducedMotion="user" transition={{ duration: duration.ui, ease }}>
      <MainLayout>
        <Suspense fallback={<div className="min-h-dvh bg-cherry" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/hair" element={<Hair />} />
            <Route path="/beauty" element={<Beauty />} />
            <Route path="/weddings" element={<Weddings />} />
            <Route path="/team" element={<Team />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book" element={<Book />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </MotionConfig>
  );
}
