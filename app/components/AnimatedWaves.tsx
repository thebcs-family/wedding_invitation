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
          min-height: 28px;
          overflow: hidden;
          pointer-events: none;
          margin: 0;
          padding: 0;
          display: block;
          line-height: 0;
        }
        
        .wave {
          position: absolute;
          bottom: -1px; /* Add a 1px overlap to eliminate any gap */
          left: 0;
          width: 200%;
          height: 100%;
          background-image: url('/wave.svg');
          background-repeat: repeat-x;
          background-size: 1600px 100%;
          margin: -2px; /* fix bugs on Iphone and the likes */
          padding: 0;
        }
        
        .wave-1 {
          z-index: 13;
          opacity: 1;
          animation: wave-animation 10s infinite;
          animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
        }
        
        .wave-2 {
          z-index: 12;
          opacity: 0.5;
          animation: wave-animation 5s infinite reverse;
          animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
        }
        
        .wave-3 {
          z-index: 11;
          opacity: 0.3;
          animation: wave-animation 15s infinite;
          animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
        }
        
        @keyframes wave-animation {
          0% {
            transform: translateX(-50px);
          }
          50% {
            transform: translateX(-300px);
          }
          100% {
            transform: translateX(-50px);
          }
        }
        
        @media (max-width: 600px) {
          .wave-container {
            height: 7vw;
            min-height: 20px;
            max-height: 40px;
          }
          .wave {
            background-size: 1600px 7vw;
            bottom: -1px; /* Maintain the overlap at smaller screens */
          }
        }
      `}</style>
    </div>
  );
}