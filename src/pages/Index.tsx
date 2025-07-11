
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { useState } from 'react';
import { ShedModel } from '../components/ShedModel';
import { ConfigPanel } from '../components/ConfigPanel';

export type ShedConfig = {
  size: 'small' | 'medium' | 'large';
  windows: 'none' | 'single' | 'double' | 'triple';
};

const Index = () => {
  const [config, setConfig] = useState<ShedConfig>({
    size: 'medium',
    windows: 'single'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            Garden Shed Configurator
          </h1>
          <p className="text-amber-700">
            Design your perfect garden shed with customizable size and window options
          </p>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="h-screen w-full">
        <Canvas
          camera={{ position: [8, 6, 8], fov: 50 }}
          shadows
          className="bg-gradient-to-b from-sky-200 to-green-200"
        >
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          <ShedModel config={config} />
          
          <ContactShadows
            position={[0, -0.1, 0]}
            opacity={0.4}
            scale={20}
            blur={2}
            far={4}
          />
          
          <Environment preset="park" background={false} />
          
          <OrbitControls
            enablePan={false}
            minDistance={5}
            maxDistance={20}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </div>

      {/* Configuration Panel */}
      <ConfigPanel config={config} setConfig={setConfig} />
    </div>
  );
};

export default Index;
