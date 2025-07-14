
import { useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { ShedConfig, getShedDimensions, getRoofConfig, getWindowPositions } from '../types/shed';
import { useShedTexture } from '../hooks/useShedTexture';
import { ShedPlanks } from './ShedPlanks';
import { ShedStructure } from './ShedStructure';

interface ShedModelProps {
  config: ShedConfig;
}

export const ShedModel = ({ config }: ShedModelProps) => {
  const groupRef = useRef<Group>(null);
  const woodTexture = useShedTexture();

  // Get dimensions and configurations
  const dimensions = getShedDimensions(config.size);
  const roofConfig = getRoofConfig(config.size, dimensions);
  const windows = getWindowPositions(config.windows, dimensions);

  const { width, height } = dimensions;

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[15, 15, 0.2, 32]} />
        <meshLambertMaterial color="#4ade80" />
      </mesh>

      {/* Main shed structure */}
      <group position={[0, height / 2, 0]}>
        {/* Vertical plank walls with roof-adjusted heights and triangular caps */}
        <ShedPlanks 
          dimensions={dimensions}
          roofConfig={roofConfig}
          woodTexture={woodTexture}
        />

        {/* Roof, door, windows, and other structures */}
        <ShedStructure
          dimensions={dimensions}
          roofConfig={roofConfig}
          windows={windows}
          config={config}
        />
      </group>

      {/* Decorative elements */}
      <mesh position={[width + 1, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[width + 1, 1.2, 0]}>
        <sphereGeometry args={[0.4]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>
    </group>
  );
};
