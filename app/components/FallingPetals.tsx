'use client';

import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  swayOffset: number;
  swaySpeed: number;
}

export default function FallingPetals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animationFrameRef = useRef<number>();
  const waveContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find the wave container
    waveContainerRef.current = document.querySelector('.wave-container');

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create initial petals
    const createPetal = (): Petal => ({
      x: Math.random() * canvas.width,
      y: -20,
      size: Math.random() * 4 + 3,
      speed: Math.random() * 1.5 + 0.5,
      angle: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.2 + 0.8,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
    });

    // Initialize petals
    petalsRef.current = Array.from({ length: 50 }, createPetal);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get wave container position
      const waveContainer = waveContainerRef.current;
      const waveBottom = waveContainer ? waveContainer.getBoundingClientRect().bottom : canvas.height;

      petalsRef.current.forEach((petal, index) => {
        // Update petal position with smoother motion
        petal.y += petal.speed;
        
        // Create a more natural swaying motion using sine waves
        const swayAmount = Math.sin(petal.swayOffset) * 0.5;
        petal.x += swayAmount;
        petal.swayOffset += petal.swaySpeed;
        
        // Add slight vertical variation to speed
        petal.speed += (Math.random() - 0.5) * 0.05;
        petal.speed = Math.max(0.3, Math.min(2, petal.speed));
        
        petal.rotation += petal.rotationSpeed;

        // Reset petal if it goes off screen or reaches the bottom of waves
        if (petal.y > waveBottom - 8) { // Minor offset so petals don't flicker in the waves
          petalsRef.current[index] = createPetal();
        }

        // Draw petal
        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.rotation);
        ctx.globalAlpha = petal.opacity;

        // Draw petal shape
        ctx.beginPath();
        ctx.moveTo(0, -petal.size);
        ctx.bezierCurveTo(
          petal.size, -petal.size,
          petal.size, petal.size,
          0, petal.size
        );
        ctx.bezierCurveTo(
          -petal.size, petal.size,
          -petal.size, -petal.size,
          0, -petal.size
        );
        ctx.fillStyle = 'rgba(255, 150, 180, 1)'; // More vibrant pink with full opacity
        ctx.fill();
        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
} 