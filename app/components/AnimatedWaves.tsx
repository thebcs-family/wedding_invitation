'use client';

// Place this file at app/components/AnimatedWaves.tsx

export default function AnimatedWaves() {
  return (
    <div className="wave-container">
      <div className="wave wave-1"></div>
      <div className="wave wave-2"></div>
      <div className="wave wave-3"></div>
      
      <style jsx>{`
        .wave-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 28px;
          overflow: hidden;
        }
        
        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 28px;
          background-image: url('/wave.svg');
          background-repeat: repeat-x;
          background-size: 1600px 28px;
        }
        
        .wave-1 {
          z-index: 3;
          opacity: 1;
          animation: wave-animation 20s infinite linear;
        }
        
        .wave-2 {
          z-index: 2;
          opacity: 0.5;
          animation: wave-animation 15s infinite linear reverse;
        }
        
        .wave-3 {
          z-index: 1;
          opacity: 0.3;
          animation: wave-animation 25s infinite linear;
        }
        
        @keyframes wave-animation {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-1600px);
          }
        }
      `}</style>
    </div>
  );
}