import { createContext, useContext } from 'react';

// introDone: the welcome intro has handed over to the page (page entrances wait for it).
// voiceDone: the welcome voice has played or been skipped (the music waits for it).
export const IntroContext = createContext({ introDone: true, voiceDone: true, finishVoice: () => {} });
export const useIntro = () => useContext(IntroContext);
