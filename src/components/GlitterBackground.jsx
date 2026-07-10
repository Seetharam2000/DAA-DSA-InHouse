import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Particles({ reducedMotion }) {
  const ref = useRef();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const sizes = [];
    const phases = [];

    for (let i = 0; i < 220; i += 1) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 6;
      positions.push(x, y, z);
      const color = [
        Math.random() > 0.7 ? 1 : 0.95,
        Math.random() > 0.5 ? 0.8 : 0.61,
        Math.random() > 0.3 ? 0.4 : 0.2,
      ];
      colors.push(...color);
      sizes.push(0.05 + Math.random() * 0.12);
      phases.push(Math.random() * Math.PI * 2);
    }

    return { positions, colors, sizes, phases };
  }, []);

  useEffect(() => {
    const onMove = (event) => {
      setPointer({ x: event.clientX / window.innerWidth - 0.5, y: event.clientY / window.innerHeight - 0.5 });
    };

    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    ref.current.rotation.y = reducedMotion ? 0 : 0.02 + pointer.x * 0.06;
    ref.current.rotation.x = reducedMotion ? 0 : 0.01 + pointer.y * 0.03;

    const positions = ref.current.geometry.attributes.position.array;
    const colors = ref.current.geometry.attributes.color.array;
    const sizes = ref.current.geometry.attributes.size.array;

    for (let i = 0; i < positions.length / 3; i += 1) {
      const baseY = positions[i * 3 + 1];
      const baseX = positions[i * 3];
      const phase = i % 26;
      const sparkle = Math.sin(time * 1.4 + particles.phases[i]) * 0.25 + 0.75;
      positions[i * 3 + 1] = baseY + delta * 0.02 + (reducedMotion ? 0 : 0.002 * Math.sin(time + phase));
      positions[i * 3] = baseX + (reducedMotion ? 0 : pointer.x * 0.002 + Math.sin(time * 0.5 + phase) * 0.0015);
      const base = 0.12 + particles.sizes[i] * sparkle;
      sizes[i] = reducedMotion ? base * 0.45 : base;
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.6 + sparkle * 0.25;
      colors[i * 3 + 2] = 0.3 + sparkle * 0.2;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.geometry.attributes.size.needsUpdate = true;
    ref.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(particles.positions), 3]}
        />
        <bufferAttribute attach="attributes-color" args={[new Float32Array(particles.colors), 3]} />
        <bufferAttribute attach="attributes-size" args={[new Float32Array(particles.sizes), 1]} />
      </bufferGeometry>
      <PointMaterial transparent depthWrite={false} size={0.08} sizeAttenuation vertexColors />
    </points>
  );
}

export default function GlitterBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <color attach="background" args={['#0F0B1A']} />
        <ambientLight intensity={0.55} />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#FF3D71" />
        <Particles reducedMotion={reducedMotion} />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,5,12,0.68)_70%,rgba(7,5,12,0.9)_100%)]" />
    </div>
  );
}
