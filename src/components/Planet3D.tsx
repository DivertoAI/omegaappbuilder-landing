// src/components/Planet3D.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useGLTF,
  Center,
} from '@react-three/drei';

function PlanetModel() {
  const gltf = useGLTF('/planet/scene.gltf', true);
  return <primitive object={gltf.scene} dispose={null} />;
}
useGLTF.preload('/planet/scene.gltf');

export default function Planet3D({
  height = 360,
  autoRotateSpeed = 0.55,
  // push the model down a touch, and look a touch higher
  modelYOffset = .5,
  targetYOffset = 0.30,
}: {
  height?: number;
  autoRotateSpeed?: number;
  modelYOffset?: number;
  targetYOffset?: number;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white"
      style={{ height }}
    >
      <Canvas
        camera={{ position: [2.4, 1.4, 2.6], fov: 40 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 6, 5]} intensity={1.2} />

        <Suspense
          fallback={
            <Html center>
              <div className="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-600 shadow-sm">
                Loading 3D…
              </div>
            </Html>
          }
        >
          {/* Center (no "top"), then nudge the model down a bit */}
          <group position={[0, modelYOffset, 0]}>
            <Center>
              <PlanetModel />
            </Center>
          </group>

          <ContactShadows position={[0, -0.8, 0]} opacity={0.25} blur={2} far={1.6} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          autoRotate
          autoRotateSpeed={autoRotateSpeed}
          enablePan={false}
          minDistance={1.6}
          maxDistance={5.5}
          target={[0, targetYOffset, 0]}
          // keep the horizon pleasant and avoid flipping
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI - 0.2}
        />
      </Canvas>
    </div>
  );
}