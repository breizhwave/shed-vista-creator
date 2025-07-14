import { ShedDimensions, RoofConfig, WindowPosition, ShedConfig } from '../types/shed';

interface ShedStructureProps {
  dimensions: ShedDimensions;
  roofConfig: RoofConfig;
  windows: WindowPosition[];
  config: ShedConfig;
}

export const ShedStructure = ({ dimensions, roofConfig, windows, config }: ShedStructureProps) => {
  const { width, height, depth } = dimensions;

  return (
    <>
      {/* Two-slope roof - adjusted for each size */}
      <group position={[0, roofConfig.roofY, 0]}>
        {/* Front slope */}
        <mesh position={[0, roofConfig.slopeY, depth * 0.29]} rotation={[Math.PI * 0.15, 0, 0]} castShadow>
          <boxGeometry args={[roofConfig.roofWidth, 0.05, roofConfig.roofDepth]} />
          <meshStandardMaterial 
            color="#654321" 
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        {/* Back slope */}
        <mesh position={[0, roofConfig.slopeY, -depth * 0.29]} rotation={[-Math.PI * 0.15, 0, 0]} castShadow>
          <boxGeometry args={[roofConfig.roofWidth, 0.05, roofConfig.roofDepth]} />
          <meshStandardMaterial 
            color="#654321" 
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        {/* Ridge beam */}
        <mesh position={[0, roofConfig.roofHeight * 0.4, 0]} castShadow>
          <boxGeometry args={[roofConfig.roofWidth, 0.1, 0.1]} />
          <meshStandardMaterial color="#5a3c1a" />
        </mesh>
      </group>

      {/* Door on front wall */}
      <mesh position={[0, -height / 4, depth / 2 + 0.08]} castShadow>
        <boxGeometry args={[1.2, height * 0.8, 0.02]} />
        <meshStandardMaterial 
          color="#8b4513"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Door handle */}
      <mesh position={[0.4, -height / 4+0.22, depth / 2 + 0.05]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windows on side walls */}
      {windows.map((window, index) => (
        <group key={index} position={[window.x, window.y, window.z]}>
          {/* Window frame */}
          <mesh castShadow rotation={window.x > 0 ? [0, Math.PI, 0] : [0, -Math.PI, 0]}>
            <boxGeometry args={[0.1, 0.6, 0.8]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
          {/* Window glass */}
          <mesh position={window.x > 0 ? [0.05, 0, 0] : [-0.05, 0, 0]} rotation={window.x > 0 ? [0, Math.PI, 0] : [0, -Math.PI, 0]}>
            <boxGeometry args={[0.02, 0.5, 0.7]} />
            <meshStandardMaterial 
              color="#87ceeb" 
              transparent 
              opacity={0.3}
              metalness={0.1}
              roughness={0.1}
            />
          </mesh>
          {/* Window cross - vertical */}
          <mesh position={window.x > 0 ? [0.06, 0, 0] : [-0.06, 0, 0]} rotation={window.x > 0 ? [0, Math.PI, 0] : [0, -Math.PI, 0]}>
            <boxGeometry args={[0.02, 0.5, 0.02]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
          {/* Window cross - horizontal */}
          <mesh position={window.x > 0 ? [0.06, 0, 0] : [-0.06, 0, 0]} rotation={window.x > 0 ? [0, Math.PI, 0] : [0, -Math.PI, 0]}>
            <boxGeometry args={[0.02, 0.02, 0.7]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        </group>
      ))}

      {/* Chimney (for larger sheds) */}
      {config.size === 'large' && (
        <mesh position={[width * 0.2, height / 2 + 0.8, -depth * 0.2]} castShadow>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      )}
    </>
  );
};