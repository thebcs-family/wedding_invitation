import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls, Html, useProgress, Text } from '@react-three/drei';
import { useTranslation, Language } from '../utils/i18n';
import * as THREE from 'three';
import ReactCountryFlag from 'react-country-flag';

interface GlobeProps {
  language: Language;
  onLocationClick?: (location: string) => void;
  messages: any[];
}

// Location coordinates in latitude and longitude
const LOCATIONS = {
  korea: { lat: 36.3504, lng: 127.3845, color: '#ff4d4d' },    // Daejeon
  bolivia: { lat: -16.4897, lng: -68.1193, color: '#4dff4d' }, // La Paz
  italy: { lat: 44.4949, lng: 11.3426, color: '#4d4dff' }      // Bologna
};

// Message positions around the globe (in percentage of container)
const getRandomPosition = (isMobile: boolean) => {
  if (isMobile) {
    const positions = [
      { top: '1%', left: '1%' },      // Top-left corner
      { top: '1%', right: '1%' },     // Top-right corner
      { bottom: '1%', left: '1%' },   // Bottom-left corner
      { bottom: '1%', right: '1%' },  // Bottom-right corner
      { top: '1%', left: '50%' },     // Top-center
      { top: '1%', right: '50%' },    // Top-center
      { bottom: '1%', left: '50%' },  // Bottom-center
      { bottom: '1%', right: '50%' }  // Bottom-center
    ];
    return positions[Math.floor(Math.random() * positions.length)];
  } else {
    const positions = [
      { top: '8%', left: '8%' },
      { top: '8%', right: '8%' },
      { top: '15%', left: '15%' },
      { top: '15%', right: '15%' },
      { bottom: '8%', left: '8%' },
      { bottom: '8%', right: '8%' },
      { bottom: '15%', left: '15%' },
      { bottom: '15%', right: '15%' },
      { top: '25%', left: '5%' },
      { top: '25%', right: '5%' },
      { bottom: '25%', left: '5%' },
      { bottom: '25%', right: '5%' }  // Bottom-center
    ];
    return positions[Math.floor(Math.random() * positions.length)];
  }
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

// Calculate distance between two points on Earth in kilometers
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
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
  const distances: { points: THREE.Vector3[], distance: number }[] = [];

  // Create lines between each pair of locations
  for (let i = 0; i < locationEntries.length; i++) {
    for (let j = i + 1; j < locationEntries.length; j++) {
      const start = latLngToVector3(locationEntries[i][1].lat, locationEntries[i][1].lng, 1.01);
      const end = latLngToVector3(locationEntries[j][1].lat, locationEntries[j][1].lng, 1.01);
      const points = createCurvedLine(start, end);
      lines.push(points);
      
      // Calculate distance for this connection
      const distance = calculateDistance(
        locationEntries[i][1].lat,
        locationEntries[i][1].lng,
        locationEntries[j][1].lat,
        locationEntries[j][1].lng
      );
      
      // Get midpoint for label placement
      const midpoint = points[Math.floor(points.length / 2)];
      distances.push({ points: [midpoint], distance });
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
      
      {/* Distance Labels */}
      {distances.map(({ points, distance }, index) => (
        <Html key={`distance-${index}`} position={points[0]} center>
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
            {distance} km
          </div>
        </Html>
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
  const distances: { points: THREE.Vector3[], distance: number, curve: THREE.Curve<THREE.Vector3> }[] = [];

  // Create lines between each pair of locations
  for (let i = 0; i < locationEntries.length; i++) {
    for (let j = i + 1; j < locationEntries.length; j++) {
      const start = latLngToVector3(locationEntries[i][1].lat, locationEntries[i][1].lng, 1.01);
      const end = latLngToVector3(locationEntries[j][1].lat, locationEntries[j][1].lng, 1.01);
      const points = createCurvedLine(start, end);
      lines.push(points);
      
      // Calculate distance for this connection
      const distance = calculateDistance(
        locationEntries[i][1].lat,
        locationEntries[i][1].lng,
        locationEntries[j][1].lat,
        locationEntries[j][1].lng
      );
      
      // Create a curve for the text to follow
      const curve = new THREE.CatmullRomCurve3(points);
      distances.push({ points, distance, curve });
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
      
      {/* Distance Labels */}
      {distances.map(({ points, distance, curve }, index) => {
        const midpoint = points[Math.floor(points.length / 2)];
        const tangent = curve.getTangent(0.5);
        
        // Calculate the normal vector pointing from the center of the sphere to the midpoint
        const normal = midpoint.clone().normalize();
        
        // Calculate the binormal (perpendicular to both tangent and normal)
        const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
        
        // Recalculate the tangent to be perpendicular to both normal and binormal
        const adjustedTangent = new THREE.Vector3().crossVectors(normal, binormal).normalize();
        
        // Create a rotation matrix that aligns the text with the surface
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeBasis(adjustedTangent, normal, binormal);
        const quaternion = new THREE.Quaternion().setFromRotationMatrix(rotationMatrix);
        
        // Position the text slightly above the surface
        const textPosition = midpoint.clone().normalize().multiplyScalar(1.02);
        
        // TODO: fix this
        // If less than 10000km, rotate 180 degrees along z-axis (super duper monkey patch)
        const rotation: [number, number, number] = distance < 10000 ? [-Math.PI/2, 0, Math.PI] : [-Math.PI/2, 0, 0];

        return (
          <group key={`distance-${index}`} position={textPosition} quaternion={quaternion}>
            <Text
              position={[0, 0, 0]}
              rotation={rotation}
              fontSize={0.08}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.003}
              outlineColor="#000000"
              outlineBlur={0.003}
              renderOrder={1}
            >
              {`${distance} km`}
            </Text>
          </group>
        );
      })}
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

function MessageCountIndicator({ position, count, isBehind, countryCode }: { position: THREE.Vector3, count: number, isBehind: boolean, countryCode: string }) {
  // Check if this is one of the special locations
  const isSpecialLocation = ['KR', 'BO', 'IT'].includes(countryCode);
  
  return (
    <Html 
      center 
      position={[0, isSpecialLocation ? 0.25 : 0.15, 0]}
      style={{
        pointerEvents: 'none',
        transform: isBehind ? 'scale(0.9)' : 'scale(1)',
        transition: 'transform 300ms ease-in-out',
      }}
    >
      <div 
        className={`bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1 transition-all duration-300 ${
          isBehind ? 'opacity-30' : 'opacity-100'
        }`}
        style={{
          transform: isBehind ? 'scale(0.9)' : 'scale(1)',
          filter: isBehind ? 'blur(0.8px)' : 'none',
          transition: 'all 300ms ease-in-out',
        }}
      >
        <svg 
          className={`w-3 h-3 transition-all duration-300 ${isBehind ? 'opacity-40' : 'opacity-100'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <ReactCountryFlag
          countryCode={countryCode}
          svg
          style={{
            width: '1em',
            height: '1em',
            opacity: isBehind ? 0.4 : 1,
            filter: isBehind ? 'blur(0.8px) saturate(0.8)' : 'none',
            transition: 'all 300ms ease-in-out',
          }}
        />
        <span 
          className={`transition-all duration-300 ${isBehind ? 'opacity-40' : 'opacity-100'}`}
        >
          {count}
        </span>
      </div>
    </Html>
  );
}

// Enhanced message bubble component with sequential animations
function FloatingMessageBubble({ 
  message, 
  countryCode, 
  messageId, 
  position,
  delay = 0,
  onComplete
}: { 
  message: any;
  countryCode: string;
  messageId: string;
  position: { top?: string, bottom?: string, left?: string, right?: string };
  delay?: number;
  onComplete?: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const timersRef = useRef<{ mount?: NodeJS.Timeout; fade?: NodeJS.Timeout; remove?: NodeJS.Timeout }>({});
  const animationStartTimeRef = useRef<number>(Date.now());

  // Check if mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  // Randomize position slightly to avoid overlap, with minimal offset for mobile
  const randomOffset = useMemo(() => {
    const margin = isMobile ? 2 : 10;
    return {
      top: position.top ? `${parseFloat(position.top) + (Math.random() * margin)}%` : undefined,
      bottom: position.bottom ? `${parseFloat(position.bottom) + (Math.random() * margin)}%` : undefined,
      left: position.left ? `${parseFloat(position.left) + (Math.random() * margin)}%` : undefined,
      right: position.right ? `${parseFloat(position.right) + (Math.random() * margin)}%` : undefined,
    };
  }, [position, isMobile]);

  useEffect(() => {
    if (mountedRef.current) return; // Prevent multiple initializations
    
    mountedRef.current = true;
    animationStartTimeRef.current = Date.now();
    
    // Clear any existing timers
    Object.values(timersRef.current).forEach(timer => timer && clearTimeout(timer));
    
    // Start fade in immediately
    timersRef.current.mount = setTimeout(() => {
      if (mountedRef.current) {
        setIsVisible(true);
      }
    }, 50);

    // Start fade out after display time
    timersRef.current.fade = setTimeout(() => {
      if (mountedRef.current) {
        setIsExiting(true);
      }
    }, delay + 3000);

    // Remove from DOM after fade out animation completes
    timersRef.current.remove = setTimeout(() => {
      if (mountedRef.current) {
        setIsVisible(false);
        onComplete?.();
      }
    }, delay + 5000);

    return () => {
      mountedRef.current = false;
      Object.values(timersRef.current).forEach(timer => timer && clearTimeout(timer));
    };
  }, [messageId]); // Only depend on messageId to prevent unnecessary effect runs

  // Add effect to log state changes
  useEffect(() => {
  }, [isVisible, isExiting, messageId]);

  const truncatedMessage = message.message.length > (isMobile ? 80 : 150) 
    ? message.message.substring(0, isMobile ? 80 : 150) + '...'
    : message.message;

  if (!isVisible) {
    return null;
  }


  return (
    <div 
      ref={bubbleRef}
      className="absolute z-20 pointer-events-none"
      style={{
        ...randomOffset,
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'translateY(-20px) scale(0.9)' : 'translateY(0) scale(1)',
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'opacity, transform',
        animation: isVisible ? 'fadeIn 0.8s ease-out' : 'none'
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      <div 
        className="bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-md shadow-lg border border-white/20 max-w-[240px]"
        style={{
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? 'scale(0.95)' : 'scale(1)'
        }}
      >
        <div className="flex items-center gap-1 mb-0.5">
          <ReactCountryFlag
            countryCode={countryCode}
            svg
            style={{
              width: '0.8em',
              height: '0.8em',
            }}
          />
          <span className="font-medium text-gray-800 text-xs">{message.name}</span>
        </div>
        <div className="text-gray-700 leading-snug text-xs whitespace-pre-wrap">{truncatedMessage}</div>
      </div>
    </div>
  );
}

function Earth({ language, onLocationClick, messages }: GlobeProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const markersRef = useRef<THREE.Group>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [behindStates, setBehindStates] = useState<{ [key: string]: boolean }>({});
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

  // Calculate message counts by country
  const messageCounts = messages.reduce((acc: { [key: string]: number }, message) => {
    if (message.country && message.country !== 'NO_COUNTRY') {
      acc[message.country] = (acc[message.country] || 0) + 1;
    }
    return acc;
  }, {});

  // Animate cloud rotation and Earth rotation
  useFrame(({ clock, camera }) => {
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

      // Update behind states for all message indicators
      const newBehindStates: { [key: string]: boolean } = {};
      Object.entries(messageCounts).forEach(([countryCode, _]) => {
        const countryCoords = getCountryCoordinates(countryCode);
        if (!countryCoords) return;

        const position = latLngToVector3(countryCoords.lat, countryCoords.lng, 1.02);
        const cameraDirection = new THREE.Vector3().subVectors(camera.position, new THREE.Vector3(0, 0, 0)).normalize();
        const markerDirection = new THREE.Vector3().subVectors(position, new THREE.Vector3(0, 0, 0)).normalize();
        const dotProduct = cameraDirection.dot(markerDirection);
        newBehindStates[countryCode] = dotProduct < 0;
      });

      // Only update state if there are changes
      const hasChanges = Object.keys(newBehindStates).some(
        key => newBehindStates[key] !== behindStates[key]
      );
      
      if (hasChanges) {
        setBehindStates(newBehindStates);
      }
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

      {/* Location markers and message indicators */}
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

        {/* Message count indicators */}
        {Object.entries(messageCounts).map(([countryCode, count]) => {
          const countryCoords = getCountryCoordinates(countryCode);
          if (!countryCoords) return null;

          const position = latLngToVector3(countryCoords.lat, countryCoords.lng, 1.02);
          const isBehind = behindStates[countryCode] || false;

          return (
            <group key={`message-${countryCode}`} position={position}>
              <MessageCountIndicator 
                position={position} 
                count={count as number} 
                isBehind={isBehind} 
                countryCode={countryCode}
              />
            </group>
          );
        })}
      </group>
    </group>
  );
}

// Helper function to get country coordinates
function getCountryCoordinates(countryCode: string): { lat: number; lng: number } | null {
  const coordinates: { [key: string]: { lat: number; lng: number } } = {
    'AF': { lat: 33.9391, lng: 67.7100 }, // Afghanistan
    'AL': { lat: 41.1533, lng: 20.1683 }, // Albania
    'DZ': { lat: 28.0339, lng: 1.6596 },  // Algeria
    'AD': { lat: 42.5063, lng: 1.5218 },  // Andorra
    'AO': { lat: -11.2027, lng: 17.8739 }, // Angola
    'AG': { lat: 17.0608, lng: -61.7964 }, // Antigua and Barbuda
    'AR': { lat: -38.4161, lng: -63.6167 }, // Argentina
    'AM': { lat: 40.0691, lng: 45.0382 }, // Armenia
    'AU': { lat: -25.2744, lng: 133.7751 }, // Australia
    'AT': { lat: 47.5162, lng: 14.5501 }, // Austria
    'AZ': { lat: 40.1431, lng: 47.5769 }, // Azerbaijan
    'BS': { lat: 25.0343, lng: -77.3963 }, // Bahamas
    'BH': { lat: 26.0667, lng: 50.5577 }, // Bahrain
    'BD': { lat: 23.6850, lng: 90.3563 }, // Bangladesh
    'BB': { lat: 13.1939, lng: -59.5432 }, // Barbados
    'BY': { lat: 53.7098, lng: 27.9534 }, // Belarus
    'BE': { lat: 50.8503, lng: 4.3517 }, // Belgium
    'BZ': { lat: 17.1899, lng: -88.4976 }, // Belize
    'BJ': { lat: 9.3077, lng: 2.3158 }, // Benin
    'BT': { lat: 27.5142, lng: 90.4336 }, // Bhutan
    'BO': { lat: -16.2902, lng: -63.5887 }, // Bolivia
    'BA': { lat: 43.9159, lng: 17.6791 }, // Bosnia and Herzegovina
    'BW': { lat: -22.3285, lng: 24.6849 }, // Botswana
    'BR': { lat: -14.2350, lng: -51.9253 }, // Brazil
    'BN': { lat: 4.5353, lng: 114.7277 }, // Brunei
    'BG': { lat: 42.7339, lng: 25.4858 }, // Bulgaria
    'BF': { lat: 12.2383, lng: -1.5616 }, // Burkina Faso
    'BI': { lat: -3.3731, lng: 29.9189 }, // Burundi
    'KH': { lat: 12.5657, lng: 104.9910 }, // Cambodia
    'CM': { lat: 7.3697, lng: 12.3547 }, // Cameroon
    'CA': { lat: 56.1304, lng: -106.3468 }, // Canada
    'CV': { lat: 16.5388, lng: -23.0418 }, // Cape Verde
    'CF': { lat: 6.6111, lng: 20.9394 }, // Central African Republic
    'TD': { lat: 15.4542, lng: 18.7322 }, // Chad
    'CL': { lat: -35.6751, lng: -71.5430 }, // Chile
    'CN': { lat: 35.8617, lng: 104.1954 }, // China
    'CO': { lat: 4.5709, lng: -74.2973 }, // Colombia
    'KM': { lat: -11.6455, lng: 43.3333 }, // Comoros
    'CG': { lat: -0.2280, lng: 15.8277 }, // Congo
    'CR': { lat: 9.7489, lng: -83.7534 }, // Costa Rica
    'HR': { lat: 45.1000, lng: 15.2000 }, // Croatia
    'CU': { lat: 21.5218, lng: -77.7812 }, // Cuba
    'CY': { lat: 35.1264, lng: 33.4299 }, // Cyprus
    'CZ': { lat: 49.8175, lng: 15.4730 }, // Czech Republic
    'DK': { lat: 56.2639, lng: 9.5018 }, // Denmark
    'DJ': { lat: 11.8251, lng: 42.5903 }, // Djibouti
    'DM': { lat: 15.4150, lng: -61.3710 }, // Dominica
    'DO': { lat: 18.7357, lng: -70.1627 }, // Dominican Republic
    'EC': { lat: -1.8312, lng: -78.1834 }, // Ecuador
    'EG': { lat: 26.8206, lng: 30.8025 }, // Egypt
    'SV': { lat: 13.7942, lng: -88.8965 }, // El Salvador
    'GQ': { lat: 1.6508, lng: 10.2679 }, // Equatorial Guinea
    'ER': { lat: 15.1794, lng: 39.7823 }, // Eritrea
    'EE': { lat: 58.5953, lng: 25.0136 }, // Estonia
    'ET': { lat: 9.1450, lng: 40.4897 }, // Ethiopia
    'FJ': { lat: -16.5782, lng: 179.4144 }, // Fiji
    'FI': { lat: 61.9241, lng: 25.7482 }, // Finland
    'FR': { lat: 46.2276, lng: 2.2137 }, // France
    'GA': { lat: -0.8037, lng: 11.6094 }, // Gabon
    'GM': { lat: 13.4432, lng: -15.3101 }, // Gambia
    'GE': { lat: 42.3154, lng: 43.3569 }, // Georgia
    'DE': { lat: 51.1657, lng: 10.4515 }, // Germany
    'GH': { lat: 7.9465, lng: -1.0232 }, // Ghana
    'GR': { lat: 39.0742, lng: 21.8243 }, // Greece
    'GD': { lat: 12.1165, lng: -61.6790 }, // Grenada
    'GT': { lat: 15.7835, lng: -90.2308 }, // Guatemala
    'GN': { lat: 9.9456, lng: -9.6966 }, // Guinea
    'GW': { lat: 11.8037, lng: -15.1804 }, // Guinea-Bissau
    'GY': { lat: 4.8604, lng: -58.9302 }, // Guyana
    'HT': { lat: 18.9712, lng: -72.2852 }, // Haiti
    'HN': { lat: 15.1999, lng: -86.2419 }, // Honduras
    'HU': { lat: 47.1625, lng: 19.5033 }, // Hungary
    'IS': { lat: 64.9631, lng: -19.0208 }, // Iceland
    'IN': { lat: 20.5937, lng: 78.9629 }, // India
    'ID': { lat: -0.7893, lng: 113.9213 }, // Indonesia
    'IR': { lat: 32.4279, lng: 53.6880 }, // Iran
    'IQ': { lat: 33.2232, lng: 43.6793 }, // Iraq
    'IE': { lat: 53.1424, lng: -7.6921 }, // Ireland
    'IL': { lat: 31.0461, lng: 34.8516 }, // Israel
    'IT': { lat: 41.8719, lng: 12.5674 }, // Italy
    'JM': { lat: 18.1096, lng: -77.2975 }, // Jamaica
    'JP': { lat: 36.2048, lng: 138.2529 }, // Japan
    'JO': { lat: 30.5852, lng: 36.2384 }, // Jordan
    'KZ': { lat: 48.0196, lng: 66.9237 }, // Kazakhstan
    'KE': { lat: -0.0236, lng: 37.9062 }, // Kenya
    'KI': { lat: -3.3704, lng: -168.7340 }, // Kiribati
    'KP': { lat: 40.3399, lng: 127.5101 }, // North Korea
    'KR': { lat: 35.9078, lng: 127.7669 }, // South Korea
    'KW': { lat: 29.3117, lng: 47.4818 }, // Kuwait
    'KG': { lat: 41.2044, lng: 74.7661 }, // Kyrgyzstan
    'LA': { lat: 19.8563, lng: 102.4955 }, // Laos
    'LV': { lat: 56.8796, lng: 24.6032 }, // Latvia
    'LB': { lat: 33.8547, lng: 35.8623 }, // Lebanon
    'LS': { lat: -29.6099, lng: 28.2336 }, // Lesotho
    'LR': { lat: 6.4281, lng: -9.4295 }, // Liberia
    'LY': { lat: 26.3351, lng: 17.2283 }, // Libya
    'LI': { lat: 47.1660, lng: 9.5554 }, // Liechtenstein
    'LT': { lat: 55.1694, lng: 23.8813 }, // Lithuania
    'LU': { lat: 49.8153, lng: 6.1296 }, // Luxembourg
    'MK': { lat: 41.6086, lng: 21.7453 }, // North Macedonia
    'MG': { lat: -18.7669, lng: 46.8691 }, // Madagascar
    'MW': { lat: -13.2543, lng: 34.3015 }, // Malawi
    'MY': { lat: 4.2105, lng: 101.9758 }, // Malaysia
    'MV': { lat: 3.2028, lng: 73.2207 }, // Maldives
    'ML': { lat: 17.5707, lng: -3.9962 }, // Mali
    'MT': { lat: 35.9375, lng: 14.3754 }, // Malta
    'MH': { lat: 7.1315, lng: 171.1845 }, // Marshall Islands
    'MR': { lat: 21.0079, lng: -10.9408 }, // Mauritania
    'MU': { lat: -20.3484, lng: 57.5522 }, // Mauritius
    'MX': { lat: 23.6345, lng: -102.5528 }, // Mexico
    'FM': { lat: 7.4256, lng: 150.5508 }, // Micronesia
    'MD': { lat: 47.4116, lng: 28.3699 }, // Moldova
    'MC': { lat: 43.7384, lng: 7.4246 }, // Monaco
    'MN': { lat: 46.8625, lng: 103.8467 }, // Mongolia
    'ME': { lat: 42.7087, lng: 19.3744 }, // Montenegro
    'MA': { lat: 31.7917, lng: -7.0926 }, // Morocco
    'MZ': { lat: -18.6657, lng: 35.5296 }, // Mozambique
    'MM': { lat: 21.9162, lng: 95.9560 }, // Myanmar
    'NA': { lat: -22.9576, lng: 18.4904 }, // Namibia
    'NR': { lat: -0.5228, lng: 166.9315 }, // Nauru
    'NP': { lat: 28.3949, lng: 84.1240 }, // Nepal
    'NL': { lat: 52.1326, lng: 5.2913 }, // Netherlands
    'NZ': { lat: -40.9006, lng: 174.8860 }, // New Zealand
    'NI': { lat: 12.8654, lng: -85.2072 }, // Nicaragua
    'NE': { lat: 17.6078, lng: 8.0817 }, // Niger
    'NG': { lat: 9.0820, lng: 8.6753 }, // Nigeria
    'NO': { lat: 60.4720, lng: 8.4689 }, // Norway
    'OM': { lat: 21.4735, lng: 55.9754 }, // Oman
    'PK': { lat: 30.3753, lng: 69.3451 }, // Pakistan
    'PW': { lat: 7.5150, lng: 134.5825 }, // Palau
    'PS': { lat: 31.9522, lng: 35.2332 }, // Palestine
    'PA': { lat: 8.5380, lng: -80.7821 }, // Panama
    'PG': { lat: -6.3150, lng: 143.9555 }, // Papua New Guinea
    'PY': { lat: -23.4425, lng: -58.4438 }, // Paraguay
    'PE': { lat: -9.1900, lng: -75.0152 }, // Peru
    'PH': { lat: 12.8797, lng: 121.7740 }, // Philippines
    'PL': { lat: 51.9194, lng: 19.1451 }, // Poland
    'PT': { lat: 39.3999, lng: -8.2245 }, // Portugal
    'QA': { lat: 25.3548, lng: 51.1839 }, // Qatar
    'RO': { lat: 45.9432, lng: 24.9668 }, // Romania
    'RU': { lat: 61.5240, lng: 105.3188 }, // Russia
    'RW': { lat: -1.9403, lng: 29.8739 }, // Rwanda
    'KN': { lat: 17.3578, lng: -62.7830 }, // Saint Kitts and Nevis
    'LC': { lat: 13.9094, lng: -60.9789 }, // Saint Lucia
    'VC': { lat: 12.9843, lng: -61.2872 }, // Saint Vincent and the Grenadines
    'WS': { lat: -13.7590, lng: -172.1046 }, // Samoa
    'SM': { lat: 43.9424, lng: 12.4578 }, // San Marino
    'ST': { lat: 0.1864, lng: 6.6131 }, // Sao Tome and Principe
    'SA': { lat: 23.8859, lng: 45.0792 }, // Saudi Arabia
    'SN': { lat: 14.7167, lng: -17.4677 }, // Senegal
    'RS': { lat: 44.0165, lng: 21.0059 }, // Serbia
    'SC': { lat: -4.6796, lng: 55.4920 }, // Seychelles
    'SL': { lat: 8.4606, lng: -11.7799 }, // Sierra Leone
    'SG': { lat: 1.3521, lng: 103.8198 }, // Singapore
    'SK': { lat: 48.6690, lng: 19.6990 }, // Slovakia
    'SI': { lat: 46.1512, lng: 14.9955 }, // Slovenia
    'SB': { lat: -9.6457, lng: 160.1562 }, // Solomon Islands
    'SO': { lat: 5.1521, lng: 46.1996 }, // Somalia
    'ZA': { lat: -30.5595, lng: 22.9375 }, // South Africa
    'SS': { lat: 6.8770, lng: 31.3070 }, // South Sudan
    'ES': { lat: 40.4637, lng: -3.7492 }, // Spain
    'LK': { lat: 7.8731, lng: 80.7718 }, // Sri Lanka
    'SD': { lat: 12.8628, lng: 30.2176 }, // Sudan
    'SR': { lat: 3.9193, lng: -56.0278 }, // Suriname
    'SE': { lat: 60.1282, lng: 18.6435 }, // Sweden
    'CH': { lat: 46.8182, lng: 8.2275 }, // Switzerland
    'SY': { lat: 34.8021, lng: 38.9968 }, // Syria
    'TW': { lat: 23.5505, lng: 121.0144 }, // Taiwan
    'TJ': { lat: 38.8610, lng: 71.2761 }, // Tajikistan
    'TZ': { lat: -6.3690, lng: 34.8888 }, // Tanzania
    'TH': { lat: 15.8700, lng: 100.9925 }, // Thailand
    'TL': { lat: -8.8742, lng: 125.7275 }, // Timor-Leste
    'TG': { lat: 8.6195, lng: 0.8248 }, // Togo
    'TO': { lat: -21.1790, lng: -175.1982 }, // Tonga
    'TT': { lat: 10.6918, lng: -61.2225 }, // Trinidad and Tobago
    'TN': { lat: 33.8869, lng: 9.5375 }, // Tunisia
    'TR': { lat: 38.9637, lng: 35.2433 }, // Turkey
    'TM': { lat: 38.9697, lng: 59.5563 }, // Turkmenistan
    'TV': { lat: -7.1095, lng: 177.6493 }, // Tuvalu
    'UG': { lat: 1.3733, lng: 32.2903 }, // Uganda
    'UA': { lat: 48.3794, lng: 31.1656 }, // Ukraine
    'AE': { lat: 23.4241, lng: 53.8478 }, // United Arab Emirates
    'GB': { lat: 55.3781, lng: -3.4360 }, // United Kingdom
    'US': { lat: 37.0902, lng: -95.7129 }, // United States
    'UY': { lat: -32.5228, lng: -55.7658 }, // Uruguay
    'UZ': { lat: 41.3775, lng: 64.5853 }, // Uzbekistan
    'VU': { lat: -15.3767, lng: 166.9592 }, // Vanuatu
    'VA': { lat: 41.9029, lng: 12.4534 }, // Vatican City
    'VE': { lat: 6.4238, lng: -66.5897 }, // Venezuela
    'VN': { lat: 14.0583, lng: 108.2772 }, // Vietnam
    'YE': { lat: 15.5527, lng: 48.5164 }, // Yemen
    'ZM': { lat: -13.1339, lng: 27.8493 }, // Zambia
    'ZW': { lat: -19.0154, lng: 29.1549 }  // Zimbabwe
  };

  return coordinates[countryCode] || null;
}

export default function Globe({ language, onLocationClick, messages }: GlobeProps) {
  const [mounted, setMounted] = useState(false);
  const [cameraPosition, setCameraPosition] = useState(2.2);
  const [fov, setFov] = useState(60);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMessages, setActiveMessages] = useState<Array<{
    message: any;
    id: string;
    position: { top?: string, bottom?: string, left?: string, right?: string };
    startTime: number;
  }>>([]);
  const messageCounterRef = useRef(0);
  const cleanupIntervalRef = useRef<NodeJS.Timeout>();
  const messageIntervalRef = useRef<NodeJS.Timeout>();

  // Memoize the filtered messages to prevent recreation on every render
  const sideMessages = useMemo(() => 
    messages.filter(message => 
      message.country && ['KR', 'BO', 'IT'].includes(message.country)
    ), [messages]
  );

  // Function to check if a position overlaps with existing messages
  const isPositionOverlapping = (newPos: { top?: string, bottom?: string, left?: string, right?: string }, existingMessages: any[]) => {
    return existingMessages.some(msg => {
      const pos = msg.position;
      return (
        (newPos.top === pos.top && newPos.left === pos.left) ||
        (newPos.top === pos.top && newPos.right === pos.right) ||
        (newPos.bottom === pos.bottom && newPos.left === pos.left) ||
        (newPos.bottom === pos.bottom && newPos.right === pos.right)
      );
    });
  };

  // Function to get a non-overlapping position
  const getNonOverlappingPosition = (existingMessages: any[]) => {
    const positions = getRandomPosition(isMobile);
    let attempts = 0;
    let newPos = positions;
    
    while (isPositionOverlapping(newPos, existingMessages) && attempts < 20) {
      newPos = getRandomPosition(isMobile);
      attempts++;
    }
    
    return newPos;
  };

  // Prevent hydration mismatch by only starting animations after mount
  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth <= 768);
  }, []);

  // Update the message cycling system
  useEffect(() => {
    if (!mounted || sideMessages.length === 0) return;

    const maxMessages = isMobile ? 3 : 5;
    const messageInterval = isMobile ? 6000 : 5000; // 6s for mobile, 5s for desktop
    const messageLifetime = isMobile ? 6000 : 5000; // 6s for mobile, 5s for desktop
    const staggerDelay = 4000; // 2 seconds between messages

    const addNewMessage = () => {
      if (sideMessages.length === 0) return;

      setActiveMessages(prev => {
        const now = Date.now();
        const filtered = prev.filter(msg => now - msg.startTime < messageLifetime);
        
        if (filtered.length >= maxMessages) {
          return filtered;
        }

        const message = sideMessages[messageCounterRef.current % sideMessages.length];
        const position = getNonOverlappingPosition(filtered);
        const messageId = `${message.country}-${messageCounterRef.current}-${now}`;

        const newMessage = {
          message,
          id: messageId,
          position,
          startTime: now
        };

        messageCounterRef.current++;
        
        return [...filtered, newMessage];
      });
    };

    // Start with first message immediately
    addNewMessage();

    // Add new messages at staggered intervals
    const addStaggeredMessage = () => {
      setTimeout(addNewMessage, staggerDelay);
    };

    // Set up the main interval for the first message of each pair
    messageIntervalRef.current = setInterval(() => {
      addNewMessage();
      addStaggeredMessage();
    }, messageInterval);

    return () => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }
    };
  }, [mounted, sideMessages, isMobile]);

  // Handle message cleanup with a longer interval
  useEffect(() => {
    if (!mounted) return;

    cleanupIntervalRef.current = setInterval(() => {
      setActiveMessages(prev => {
        const now = Date.now();
        return prev.filter(msg => now - msg.startTime < 10000);
      });
    }, 2000); // Check less frequently

    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
    };
  }, [mounted]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mounted]);

  // Camera positioning effect
  useEffect(() => {
    if (!mounted) return;
    
    const handleResize = () => {
      const width = window.innerWidth;
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
  }, [mounted]);

  // Don't render Canvas until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="h-[500px] w-full bg-transparent rounded-lg overflow-visible relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Loading globe...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full bg-transparent rounded-lg overflow-visible relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-[400px] relative">
          <Canvas 
            camera={{ position: [0, 0, cameraPosition], fov }}
            gl={{ alpha: true, antialias: true }}
          >
            <color attach="background" args={['#f7fff7']} />
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Earth language={language} onLocationClick={onLocationClick} messages={messages} />
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
        </div>
      </div>

      {/* Sequential message bubbles - only render after mount */}
      <div className="absolute inset-0 pointer-events-none">
        {activeMessages.map((activeMessage) => (
          <FloatingMessageBubble 
            key={activeMessage.id}
            message={activeMessage.message}
            countryCode={activeMessage.message.country}
            messageId={activeMessage.id}
            position={activeMessage.position}
            delay={0}
            onComplete={() => {
              setActiveMessages(prev => prev.filter(msg => msg.id !== activeMessage.id));
            }}
          />
        ))}
      </div>
    </div>
  );
}