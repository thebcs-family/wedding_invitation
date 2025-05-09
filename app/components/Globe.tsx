'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls, Html, useProgress } from '@react-three/drei';
import { useTranslation, Language } from '../utils/i18n';
import * as THREE from 'three';

interface GlobeProps {
  language: Language;
  onLocationClick?: (location: string) => void;
}

// Location coordinates in latitude and longitude
const LOCATIONS = {
  korea: { lat: 36.3504, lng: 127.3845, color: '#ff4d4d' },    // Daejeon
  bolivia: { lat: -16.4897, lng: -68.1193, color: '#4dff4d' }, // La Paz
  italy: { lat: 44.4949, lng: 11.3426, color: '#4d4dff' }      // Bologna
};

// Convert lat/lng to 3D coordinates on a sphere
const latLngToVector3 = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

function LoadingScreen() {
  const { progress } = useProgress();
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent">
      <div className="text-gray-700 text-xl">
        Loading... {Math.round(progress)}%
      </div>
    </div>
  );
}

function LocationCard({ content, isBehind, isDaejeon, onClick }: { content: string; isBehind: boolean; isDaejeon?: boolean; onClick?: () => void }) {
  return (
    <>
      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
          }
        }
      `}</style>
      <div 
        className={`bg-white p-2 rounded-lg shadow-lg whitespace-nowrap transform transition-all duration-300 cursor-pointer ${
          isBehind ? 'opacity-50 scale-90' : 'opacity-100 scale-100'
        } ${isDaejeon ? 'border-2 border-red-500' : ''}`}
        onClick={onClick}
      >
        <div 
          className={`text-sm font-medium ${isDaejeon ? 'text-red-500 animate-[glow_2s_ease-in-out_infinite]' : 'text-gray-800'}`}
        >
          {content}
        </div>
      </div>
    </>
  );
}

function LocationMarker({ position, color, name, isHovered, onClick, tooltipContent, cameraPosition }: any) {
  const markerRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [isBehind, setIsBehind] = useState(false);
  const isDaejeon = name === 'korea';
  
  useFrame(({ camera, clock }) => {
    if (glowRef.current) {
      // Special animation for Daejeon
      if (isDaejeon) {
        const time = clock.getElapsedTime();
        const pulseScale = 1 + Math.sin(time * 3) * 0.3; // Faster, more pronounced pulse
        glowRef.current.scale.setScalar(pulseScale);
      } else {
        // Regular animation for other markers
        glowRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 2) * 0.1);
      }
    }

    // Check if location is behind the globe
    const markerPosition = new THREE.Vector3().copy(position);
    const cameraDirection = new THREE.Vector3().subVectors(camera.position, new THREE.Vector3(0, 0, 0)).normalize();
    const markerDirection = new THREE.Vector3().subVectors(markerPosition, new THREE.Vector3(0, 0, 0)).normalize();
    const dotProduct = cameraDirection.dot(markerDirection);
    setIsBehind(dotProduct < 0);
  });

  return (
    <group position={position} onClick={onClick}>
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={isBehind ? 0.6 : 0.3} 
        />
      </mesh>
      <Html center position={[0, 0.1, 0]}>
        <LocationCard 
          content={tooltipContent} 
          isBehind={isBehind} 
          isDaejeon={isDaejeon}
          onClick={onClick}
        />
      </Html>
    </group>
  );
}

function Earth({ language, onLocationClick }: GlobeProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const markersRef = useRef<THREE.Group>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const { t } = useTranslation(language);
  
  // Load earth textures
  const [colorMap, normalMap, specularMap, cloudMap] = useLoader(TextureLoader, [
    '/images/earth_daymap.jpg',
    '/images/earth_normal.jpg',
    '/images/earth_specular.jpg',
    '/images/earth_clouds.png'
  ]);

  // Configure texture settings
  useEffect(() => {
    if (colorMap && normalMap && specularMap && cloudMap) {
      colorMap.colorSpace = THREE.SRGBColorSpace;
      normalMap.colorSpace = THREE.NoColorSpace;
      specularMap.colorSpace = THREE.NoColorSpace;
      cloudMap.colorSpace = THREE.SRGBColorSpace;
    }
  }, [colorMap, normalMap, specularMap, cloudMap]);

  // Animate cloud rotation and Earth rotation
  useFrame(({ clock }) => {
    if (cloudRef.current && earthRef.current && markersRef.current) {
      const time = clock.getElapsedTime();
      
      // Create complex cloud movement
      const baseRotation = time * 0.04; // Slower base rotation
      const spiralEffect = Math.sin(time * 0.2) * 0.1; // Spiral effect
      const verticalWobble = Math.sin(time * 0.15) * 0.02; // Vertical wobble
      const horizontalWobble = Math.cos(time * 0.1) * 0.02; // Horizontal wobble
      
      // Apply organic cloud movement with spiral effect
      cloudRef.current.rotation.y = baseRotation + spiralEffect;
      cloudRef.current.rotation.x = verticalWobble;
      cloudRef.current.rotation.z = horizontalWobble;
      
      // Gentle Earth rotation
      const earthRotation = time * 0.05;
      earthRef.current.rotation.y = earthRotation;
      markersRef.current.rotation.y = earthRotation;
    }
  });

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={[0.5, 0.5]}
          specularMap={specularMap}
          shininess={5}
          bumpMap={normalMap}
          bumpScale={0.05}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshPhongMaterial
          map={cloudMap}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Location markers - now properly synced with Earth rotation */}
      <group ref={markersRef}>
        {Object.entries(LOCATIONS).map(([name, data]) => {
          const position = latLngToVector3(data.lat, data.lng, 1.01);
          const tooltipContent = t.locations[name as keyof typeof LOCATIONS].title;
          
          return (
            <LocationMarker
              key={name}
              position={position}
              color={data.color}
              name={name}
              isHovered={hoveredLocation === name}
              onClick={() => onLocationClick?.(name)}
              onPointerEnter={() => setHoveredLocation(name)}
              onPointerLeave={() => setHoveredLocation(null)}
              tooltipContent={tooltipContent}
            />
          );
        })}
      </group>
    </group>
  );
}

export default function Globe({ language, onLocationClick }: GlobeProps) {
  const [mounted, setMounted] = useState(false);
  const [cameraPosition, setCameraPosition] = useState(2.2);
  const [fov, setFov] = useState(60);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      const width = window.innerWidth;
      // More gradual transitions with additional breakpoints
      if (width <= 384) {
        setCameraPosition(2.8);
        setFov(60);
      } else if (width <= 480) {
        setCameraPosition(2.5);
        setFov(50);
      } else if (width <= 640) {
        setCameraPosition(2.8);
        setFov(45);
      } else if (width <= 768) {
        setCameraPosition(2.5);
        setFov(50);
      } else if (width <= 1024) {
        setCameraPosition(2.3);
        setFov(55);
      } else {
        setCameraPosition(2.2);
        setFov(60);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[600px] w-full bg-transparent rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-gray-700 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full bg-transparent rounded-lg overflow-hidden">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas 
          camera={{ position: [0, 0, cameraPosition], fov }}
          gl={{ alpha: true, antialias: true }}
        >
          <color attach="background" args={['transparent']} />
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Earth language={language} onLocationClick={onLocationClick} />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            autoRotate={false}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            enableRotate={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </Suspense>
    </div>
  );
} 