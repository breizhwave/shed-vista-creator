import { Texture } from 'three';
import { ShedDimensions, RoofConfig } from '../types/shed';
import { calculatePlankHeight, calculateTriangleCapHeight } from '../utils/shedUtils';

interface ShedPlanksProps {
  dimensions: ShedDimensions;
  roofConfig: RoofConfig;
  woodTexture: Texture;
}

export const ShedPlanks = ({ dimensions, roofConfig, woodTexture }: ShedPlanksProps) => {
  const { width, height, depth } = dimensions;

  // Create vertical planks for walls with roof-adjusted heights and triangular caps
  const createVerticalPlanks = (wallWidth: number, wallHeight: number, position: [number, number, number], rotation: [number, number, number] = [0, 0, 0]) => {
    const plankWidth = 0.15;
    const plankThickness = 0.05;
    const numPlanks = Math.floor(wallWidth / plankWidth);
    const planks = [];

    for (let i = 0; i < numPlanks; i++) {
      let xOffset = (i - numPlanks / 2) * plankWidth + plankWidth / 2;
      let zOffset = 0;
      let actualPlankHeight = wallHeight;
      let triangleCapHeight = 0;
      
      if (rotation[1] > 0) {
        zOffset = xOffset;
        xOffset = 0;
        // For side walls, adjust height based on Z position
        actualPlankHeight = calculatePlankHeight(position[2] + zOffset, dimensions, roofConfig);
        triangleCapHeight = calculateTriangleCapHeight(position[2] + zOffset, dimensions, roofConfig);
      } else {
        // For front/back walls, adjust height based on distance from center
        if (position[2] > 0) { // Front wall
          actualPlankHeight = calculatePlankHeight(position[2], dimensions, roofConfig, false);
          triangleCapHeight = calculateTriangleCapHeight(position[2], dimensions, roofConfig);
        } else { // Back wall
          actualPlankHeight = calculatePlankHeight(position[2], dimensions, roofConfig, true);
          triangleCapHeight = calculateTriangleCapHeight(position[2], dimensions, roofConfig);
        }
      }

      // Adjust Y position to account for varying plank heights
      const yAdjustment = (actualPlankHeight - wallHeight) / 2;

      // Main rectangular plank
      planks.push(
        <mesh
          key={i}
          position={[position[0] + xOffset, position[1] + yAdjustment, position[2] + zOffset]}
          rotation={rotation}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[plankWidth * 0.9, actualPlankHeight, plankThickness]} />
          <meshStandardMaterial 
            map={woodTexture}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      );

      // Triangular cap piece on top of plank
      if (triangleCapHeight > 0.05) {
        const capY = position[1] + yAdjustment + actualPlankHeight / 2 + triangleCapHeight / 2;
        planks.push(
          <mesh
            key={`cap-${i}`}
            position={[position[0] + xOffset, capY, position[2] + zOffset]}
            rotation={rotation}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[plankWidth * 0.9, triangleCapHeight, plankThickness]} />
            <meshStandardMaterial 
              map={woodTexture}
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        );
      }
    }
    return planks;
  };

  return (
    <>
      {/* Front wall */}
      {createVerticalPlanks(width, height, [0, 0, depth / 2 + 0.025])}
      
      {/* Back wall */}
      {createVerticalPlanks(width, height, [0, 0, -depth / 2 - 0.025])}
      
      {/* Right wall */}
      {createVerticalPlanks(depth, height, [width / 2 + 0.025, 0, 0], [0, Math.PI / 2, 0])}
      
      {/* Left wall */}
      {createVerticalPlanks(depth, height, [-width / 2 - 0.025, 0, 0], [0, Math.PI / 2, 0])}
    </>
  );
};