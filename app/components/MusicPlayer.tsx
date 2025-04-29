'use client';

import { useState } from 'react';
import Image from 'next/image';

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
      <audio id="bgMusic" src="/music/wedding.mp3" loop />
      <button
        className="fixed bottom-8 right-8 z-50 bg-[#b6cfa6] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-[#72999d] transition-colors"
        onClick={toggleMusic}
      >
        <Image
          src={isMusicPlaying ? "/images/pause.png" : "/images/play.png"}
          alt={isMusicPlaying ? "Pause" : "Play"}
          width={32}
          height={32}
        />
      </button>
    </>
  );
} 