'use client';

import { useState } from 'react';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';

export default function MusicPlayer() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const toggleMusic = () => {
    const audio = document.getElementById('bgMusic') as HTMLAudioElement;
    if (audio.paused) {
      audio.play();
      setIsMusicPlaying(true);
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  };

  return (
    <>
      {/* Music source: https://pixabay.com/music/wedding-wedding-121843/ */}
      <audio id="bgMusic" src="/music/wedding.mp3" loop />
      <button
        className="fixed bottom-4 left-4 z-50 bg-white/90 backdrop-blur-sm text-[#72999d] rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-[#72999d] hover:text-white transition-all duration-300"
        onClick={toggleMusic}
        aria-label={isMusicPlaying ? "Pause music" : "Play music"}
      >
        {isMusicPlaying ? (
          <MusicNoteIcon className="w-6 h-6" />
        ) : (
          <MusicOffIcon className="w-6 h-6" />
        )}
      </button>
    </>
  );
} 