import { asset } from '../utils/asset';
// Background music for the site player. Files live in public/music (AAC 160 kbps, encoded from the WAV masters in
// the Elite Hair and Beauty asset folder). Licensed tracks supplied by Clint: make sure each licence covers this
// website. Played in this order; the playlist loops.
// To change the music: put the new file in public/music, list it here, and bump MUSIC_VERSION so browsers fetch the
// new file instead of a cached one.
export const MUSIC_VERSION = '2026-11-20';

export const tracks = [
  { title: 'Beauty', note: 'Kirill Luzin', src: `${asset('music/')}beauty.m4a?v=${MUSIC_VERSION}` },
  { title: 'Lofi Chill Hip-Hop', note: 'Kornev Music', src: `${asset('music/')}lofi-chill.m4a?v=${MUSIC_VERSION}` },
  { title: 'Lofi Jazz', note: 'Kornev Music', src: `${asset('music/')}lofi-jazz.m4a?v=${MUSIC_VERSION}` },
];
