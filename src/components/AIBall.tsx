import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, PerspectiveCamera, OrbitControls, Points, PointMaterial, Text, Billboard, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Satellite = ({ radius, speed, offset, color, label, size = 0.12 }: { radius: number; speed: number; offset: number; color: string; label: string; size?: number }) => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime() * speed + offset;
    ref.current.position.x = Math.cos(time) * radius;
    ref.current.position.z = Math.sin(time) * radius;
    ref.current.position.y = 0;
  });

  return (
    <group ref={ref}>
      {/* Core "Bulb" - The actual light source */}
      <mesh castShadow>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={12} 
          roughness={0}
          metalness={1}
        />
      </mesh>
      
      {/* Outer Glow / Halo - Makes it look like a bulb in the dark */}
      <mesh>
        <sphereGeometry args={[size * 1.5, 32, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Secondary Pulse Aura */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh>
          <sphereGeometry args={[size * 2.2, 16, 16]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.05} 
            wireframe
          />
        </mesh>
      </Float>

      <Billboard position={[0, size + 1.2, 0]}>
        <Text
          fontSize={0.5}
          color={color}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {label}
        </Text>
      </Billboard>
      
      {/* Intense Point Light - Casts light on the "Galaxy" */}
      <pointLight intensity={5} distance={6} color={color} decay={2} />
      
      {/* Orbit Path - Neon Beam Effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.03, 16, 200]} />
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.4} 
          emissive={color} 
          emissiveIntensity={10}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

const DecorativeOrbit = ({ radius, rotation, color }: { radius: number; rotation: [number, number, number]; color: string }) => (
  <mesh rotation={rotation}>
    <torusGeometry args={[radius, 0.003, 16, 100]} />
    <meshBasicMaterial color={color} transparent opacity={0.1} />
  </mesh>
);

const RotatingTextRing = () => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={ref} position={[0, 0, 0]}>
      {[...Array(8)].map((_, i) => (
        <Billboard
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 6.4,
            0,
            Math.sin((i / 8) * Math.PI * 2) * 6.4
          ]}
        >
          <Text
            fontSize={0.6}
            color="#00E5FF"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.06}
            outlineColor="#000000"
          >
            PARSENT
          </Text>
          <pointLight intensity={2} distance={4} color="#00E5FF" />
        </Billboard>
      ))}
      
      {/* Central Axis Ring - Flashier */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[6.4, 0.04, 16, 128]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={4} transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

const GalacticDust = () => {
  const points = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 40;
      p[i * 3 + 1] = (Math.random() - 0.5) * 40;
      p[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return p;
  }, []);

  return (
    <Points positions={points}>
      <PointMaterial
        transparent
        color="#6A1FFF"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.2}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const Globe = ({ scrollProgress }: { scrollProgress: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const globeRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  
  const satellites = useMemo(() => [
    { radius: 13.0, speed: 0.4, offset: 0, color: "#00E5FF", label: "REDDIT", size: 0.44 },
    { radius: 17.0, speed: 0.25, offset: Math.PI * 0.4, color: "#6A1FFF", label: "X_TWITTER", size: 0.52 },
    { radius: 21.0, speed: 0.15, offset: Math.PI * 0.8, color: "#D4A85A", label: "NEWS_FEED", size: 0.6 },
    { radius: 25.0, speed: 0.3, offset: Math.PI * 1.2, color: "#00FF9C", label: "SENTIMENT", size: 0.56 },
    { radius: 29.0, speed: 0.1, offset: Math.PI * 1.6, color: "#FF4444", label: "AUDIT_LOGS", size: 0.7 },
    { radius: 33.0, speed: 0.2, offset: Math.PI * 0.2, color: "#FF00FF", label: "NEURAL_NET", size: 0.8 },
    { radius: 37.0, speed: 0.08, offset: Math.PI * 0.6, color: "#FF8C00", label: "GLOBAL_PULSE", size: 0.76 },
    { radius: 41.0, speed: 0.12, offset: Math.PI * 1.0, color: "#ADFF2F", label: "DATA_STREAM", size: 0.68 },
  ], []);

  const decorativeOrbits = useMemo(() => [
    { radius: 12.0, rotation: [Math.PI / 2, 0, 0] as [number, number, number], color: "#00E5FF" },
    { radius: 17.0, rotation: [Math.PI / 2, 0, 0] as [number, number, number], color: "#6A1FFF" },
    { radius: 24.0, rotation: [Math.PI / 2, 0, 0] as [number, number, number], color: "#00FF9C" },
    { radius: 36.0, rotation: [Math.PI / 2, 0, 0] as [number, number, number], color: "#FF4444" },
  ], []);

  useFrame((state) => {
    if (!groupRef.current || !globeRef.current || !outerRingRef.current) return;
    const time = state.clock.getElapsedTime();
    
    globeRef.current.rotation.y = time * 0.1;
    
    outerRingRef.current.rotation.z = time * 0.2;
    outerRingRef.current.rotation.x = 0;
    
    // Pulse effect - More intense for "Sun"
    const scale = 1 + Math.sin(time * 3) * 0.05;
    globeRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef}>
      {/* Central Tech Sun (Globe) - 2x Bigger */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[7.5, 64, 64]} />
        <meshStandardMaterial 
          color="#00E5FF" 
          wireframe 
          transparent 
          opacity={0.4} 
          emissive="#00E5FF"
          emissiveIntensity={25}
        />
      </mesh>
      
      {/* Sun Glow with Wave Pattern */}
      <mesh>
        <sphereGeometry args={[8.0, 64, 64]} />
        <MeshDistortMaterial
          color="#00E5FF"
          distort={0.5}
          speed={3}
          transparent
          opacity={0.2}
          emissive="#00E5FF"
          emissiveIntensity={15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <pointLight intensity={40} distance={60} color="#00E5FF" decay={2} />

      {/* Decorative Orbits - Neon Beams */}
      {decorativeOrbits.map((orbit, i) => (
        <mesh key={i} rotation={orbit.rotation}>
          <torusGeometry args={[orbit.radius, 0.04, 16, 128]} />
          <meshStandardMaterial 
            color={orbit.color} 
            transparent 
            opacity={0.5} 
            emissive={orbit.color} 
            emissiveIntensity={15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Outer Tech Ring - Flashier */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[8.4, 0.1, 16, 128]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={15} transparent opacity={0.6} />
      </mesh>
      
      {/* Inner Core - The Heart */}
      <Sphere args={[5.4, 48, 48]}>
        <MeshDistortMaterial
          color="#6A1FFF"
          distort={0.6}
          speed={4}
          roughness={0}
          metalness={1}
          emissive="#6A1FFF"
          emissiveIntensity={20}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Rotating Text Ring - Main Axis */}
      <RotatingTextRing />

      {/* Satellites with Labels and Orbits */}
      {satellites.map((sat, i) => (
        <Satellite key={i} {...sat} />
      ))}

      {/* Galactic Background Elements */}
      <GalacticDust />
      
      {/* Star Field - Denser and more varied */}
      <Points>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

export const AIBallScene = ({ scrollProgress }: { scrollProgress: number }) => {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas>
        <PerspectiveCamera makeDefault position={[40, 40, 60]} />
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.2}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={5} color="#00E5FF" />
        <pointLight position={[-10, -10, -10]} intensity={3} color="#6A1FFF" />
        <Globe scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
};
