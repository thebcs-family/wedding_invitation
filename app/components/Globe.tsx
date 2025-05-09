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

function createCurvedLine(start: THREE.Vector3, end: THREE.Vector3, radius: number = 1.01) {
  const points: THREE.Vector3[] = [];
  const segments = 50;
  
  // Calculate the midpoint and raise it above the sphere
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const midpointLength = midpoint.length();
  const height = 0.15; // Increased from 0.05 to 0.15 to make the curve higher
  midpoint.normalize().multiplyScalar(radius + height);
  
  // Create points along the curve
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = new THREE.Vector3();
    
    // Quadratic Bezier curve
    point.x = Math.pow(1 - t, 2) * start.x + 2 * (1 - t) * t * midpoint.x + Math.pow(t, 2) * end.x;
    point.y = Math.pow(1 - t, 2) * start.y + 2 * (1 - t) * t * midpoint.y + Math.pow(t, 2) * end.y;
    point.z = Math.pow(1 - t, 2) * start.z + 2 * (1 - t) * t * midpoint.z + Math.pow(t, 2) * end.z;
    
    // Project the point back onto the sphere's surface
    const length = point.length();
    point.multiplyScalar(radius / length);
    
    points.push(point);
  }
  
  return points;
}

function ConnectionLines({ locations }: { locations: typeof LOCATIONS }) {
  const linesRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  
  useFrame(({ clock }) => {
    if (linesRef.current) {
      // Rotate the lines with the Earth
      linesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }

    // Animate the line color
    if (materialRef.current) {
      const time = clock.getElapsedTime();
      // Create a pulsing effect with the opacity
      const opacity = 0.3 + Math.sin(time * 2) * 0.1;
      materialRef.current.opacity = opacity;
    }
  });

  const locationEntries = Object.entries(locations);
  const lines: THREE.Vector3[][] = [];

  // Create lines between each pair of locations
  for (let i = 0; i < locationEntries.length; i++) {
    for (let j = i + 1; j < locationEntries.length; j++) {
      const start = latLngToVector3(locationEntries[i][1].lat, locationEntries[i][1].lng, 1.01);
      const end = latLngToVector3(locationEntries[j][1].lat, locationEntries[j][1].lng, 1.01);
      lines.push(createCurvedLine(start, end));
    }
  }

  return (
    <group ref={linesRef}>
      {lines.map((points, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            ref={materialRef}
            color="#ffffff" 
            transparent 
            opacity={0.4}
            linewidth={2}
          />
        </line>
      ))}
    </group>
  );
}

function AnimatedConnectionLines({ locations }: { locations: typeof LOCATIONS }) {
  const linesRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  const locationEntries = Object.entries(locations);
  const lines: THREE.Vector3[][] = [];

  // Create lines between each pair of locations
  for (let i = 0; i < locationEntries.length; i++) {
    for (let j = i + 1; j < locationEntries.length; j++) {
      const start = latLngToVector3(locationEntries[i][1].lat, locationEntries[i][1].lng, 1.01);
      const end = latLngToVector3(locationEntries[j][1].lat, locationEntries[j][1].lng, 1.01);
      lines.push(createCurvedLine(start, end));
    }
  }

  // Custom shader material for animated gradient
  const shaderMaterial = {
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color('#ff4d4d') }, // Korea color
      color2: { value: new THREE.Color('#4dff4d') }, // Bolivia color
      color3: { value: new THREE.Color('#4d4dff') }, // Italy color
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      varying vec2 vUv;
      
      void main() {
        float t = mod(time * 0.1, 1.0);
        vec3 color;
        
        if (t < 0.33) {
          color = mix(color1, color2, t * 3.0);
        } else if (t < 0.66) {
          color = mix(color2, color3, (t - 0.33) * 3.0);
        } else {
          color = mix(color3, color1, (t - 0.66) * 3.0);
        }
        
        gl_FragColor = vec4(color, 0.7);
      }
    `,
  };

  return (
    <group ref={linesRef}>
      {lines.map((points, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-uv"
              count={points.length}
              array={new Float32Array(points.map((_, i) => [i / (points.length - 1), 0]).flat())}
              itemSize={2}
            />
          </bufferGeometry>
          <shaderMaterial
            ref={materialRef}
            attach="material"
            args={[shaderMaterial]}
            transparent
            linewidth={3}
          />
        </line>
      ))}
    </group>
  );
}

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

      {/* Animated connection lines */}
      <AnimatedConnectionLines locations={LOCATIONS} />

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