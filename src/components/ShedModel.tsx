
import { useRef } from 'react';
import { Group, Mesh } from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { ShedConfig } from '../pages/Index';

interface ShedModelProps {
  config: ShedConfig;
}

export const ShedModel = ({ config }: ShedModelProps) => {
  const groupRef = useRef<Group>(null);
  
  // Load wood texture
  const woodTexture = useLoader(TextureLoader, '/lovable-uploads/cfe6db52-b186-418f-b439-e440ab516521.png');
  
  // Configure texture for wood planks
  woodTexture.wrapS = woodTexture.wrapT = 1000; // RepeatWrapping
  woodTexture.repeat.set(1, 4); // Repeat vertically for plank effect

  // Get dimensions based on size
  const getDimensions = () => {
    switch (config.size) {
      case 'small':
        return { width: 3, height: 2.5, depth: 2 };
      case 'medium':
        return { width: 4, height: 2.5, depth: 3 };
      case 'large':
        return { width: 5, height: 2.5, depth: 4 };
    }
  };

  const { width, height, depth } = getDimensions();

  // Get roof configuration based on size
  const getRoofConfig = () => {
    switch (config.size) {
      case 'small':
        return { 
          roofHeight: 0.3, 
          roofWidth: width + 0.2, 
          roofDepth: depth/2 + 0.3,
          roofY: height / 2 + 0.3,
          slopeY: -0.1,
          roofAngle: Math.PI * 0.15
        };
      case 'medium':
        return { 
          roofHeight: 0.5, 
          roofWidth: width + 0.2, 
          roofDepth: depth/2 + 0.5,
          roofY: height / 2 + 0.5,
          slopeY: -0.17,
          roofAngle: Math.PI * 0.15
        };
      case 'large':
        return { 
          roofHeight: 0.7, 
          roofWidth: width + 0.3, 
          roofDepth: depth/2 + 0.7,
          roofY: height / 2 + 0.7,
          slopeY: -0.25,
          roofAngle: Math.PI * 0.15
        };
    }
  };

  const roofConfig = getRoofConfig();

  // Get window configuration for side walls
  const getWindowConfig = () => {
    const windowWidth = 0.8;
    const windowHeight = 0.6;
    const windowY = height * 0.3;

    switch (config.windows) {
      case 'none':
        return [];
      case 'single':
        return [{ x: width / 2 + 0.01, y: windowY, z: 0 }]; // Right side
      case 'double':
        return [
          { x: width / 2 + 0.01, y: windowY, z: 0 }, // Right side
          { x: -width / 2 - 0.01, y: windowY, z: 0 } // Left side
        ];
      case 'triple':
        return [
          { x: width / 2 + 0.01, y: windowY, z: depth * 0.2 }, // Right side front
          { x: width / 2 + 0.01, y: windowY, z: -depth * 0.2 }, // Right side back
          { x: -width / 2 - 0.01, y: windowY, z: 0 } // Left side center
        ];
    }
  };

  const windows = getWindowConfig();

  // Calculate plank height based on roof slope and position
  const calculatePlankHeight = (zPosition: number, isBackWall: boolean = false) => {
    const baseHeight = height;
    const roofSlope = Math.tan(roofConfig.roofAngle);
    const distanceFromCenter = Math.abs(zPosition);
    const maxDistanceFromCenter = depth / 2;
    
    // Calculate how much to add based on distance from edge and roof slope
    // Planks are tallest at center (z=0) and shortest at edges (z=±depth/2)
    const heightAddition = (maxDistanceFromCenter - distanceFromCenter) * roofSlope * 0.8;
    
    return Math.max(baseHeight + heightAddition, baseHeight * 0.8); // Minimum 80% of base height
  };

  // Calculate triangular cap height to reach roof
  const calculateTriangleCapHeight = (zPosition: number) => {
    const roofSlope = Math.tan(roofConfig.roofAngle);
    const distanceFromCenter = Math.abs(zPosition);
    const maxDistanceFromCenter = depth / 2;
    
    // Height difference between plank top and roof at this position
    const roofHeightAtPosition = roofConfig.roofY + roofConfig.slopeY + (maxDistanceFromCenter - distanceFromCenter) * roofSlope * 0.3;
    const plankHeight = calculatePlankHeight(zPosition);
    const plankTopY = height / 2 + (plankHeight - height) / 2 + plankHeight / 2;
    
    return Math.max(roofHeightAtPosition - plankTopY, 0.05); // Minimum cap height
  };

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
        actualPlankHeight = calculatePlankHeight(position[2] + zOffset);
        triangleCapHeight = calculateTriangleCapHeight(position[2] + zOffset);
      } else {
        // For front/back walls, adjust height based on distance from center
        if (position[2] > 0) { // Front wall
          actualPlankHeight = calculatePlankHeight(position[2], false);
          triangleCapHeight = calculateTriangleCapHeight(position[2]);
        } else { // Back wall
          actualPlankHeight = calculatePlankHeight(position[2], true);
          triangleCapHeight = calculateTriangleCapHeight(position[2]);
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
        {/* Front wall */}
        {createVerticalPlanks(width, height, [0, 0, depth / 2 + 0.025])}
        
        {/* Back wall */}
        {createVerticalPlanks(width, height, [0, 0, -depth / 2 - 0.025])}
        
        {/* Right wall */}
        {createVerticalPlanks(depth, height, [width / 2 + 0.025, 0, 0], [0, Math.PI / 2, 0])}
        
        {/* Left wall */}
        {createVerticalPlanks(depth, height, [-width / 2 - 0.025, 0, 0], [0, Math.PI / 2, 0])}

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
        <mesh position={[0, -height / 4, depth / 2 + 0.03]} castShadow>
          <boxGeometry args={[1.2, height * 0.8, 0.02]} />
          <meshStandardMaterial 
            color="#8b4513"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Door handle */}
        <mesh position={[0.4, -height / 4, depth / 2 + 0.05]}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Windows on side walls */}
        {windows.map((window, index) => (
          <group key={index} position={[window.x, window.y, window.z]}>
            {/* Window frame */}
            <mesh castShadow rotation={window.x > 0 ? [0, Math.PI  , 0] : [0, -Math.PI  , 0]}>
              <boxGeometry args={[0.1, 0.6, 0.8]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
            {/* Window glass */}
            <mesh position={window.x > 0 ? [0.05, 0, 0] : [-0.05, 0, 0]} rotation={window.x > 0 ? [0, Math.PI , 0] : [0, -Math.PI  , 0]}>
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
            <mesh position={window.x > 0 ? [ 0.06, 0, 0] : [-0.06, 0, 0]} rotation={window.x > 0 ? [0, Math.PI , 0] : [0, -Math.PI  , 0]}>
              <boxGeometry args={[0.02, 0.5, 0.02]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
            {/* Window cross - horizontal */}
            <mesh position={window.x > 0 ? [ 0.06, 0, 0] : [-0.06, 0, 0]} rotation={window.x > 0 ? [0, Math.PI  , 0] : [0, -Math.PI  , 0]}>
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
