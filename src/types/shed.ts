export interface ShedConfig {
  size: 'small' | 'medium' | 'large';
  windows: 'none' | 'single' | 'double' | 'triple';
}

export interface ShedDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface RoofConfig {
  roofHeight: number;
  roofWidth: number;
  roofDepth: number;
  roofY: number;
  slopeY: number;
  roofAngle: number;
}

export interface WindowPosition {
  x: number;
  y: number;
  z: number;
}

export const getShedDimensions = (size: ShedConfig['size']): ShedDimensions => {
  switch (size) {
    case 'small':
      return { width: 3, height: 2.5, depth: 2 };
    case 'medium':
      return { width: 4, height: 2.5, depth: 3 };
    case 'large':
      return { width: 5, height: 2.5, depth: 4 };
  }
};

export const getRoofConfig = (size: ShedConfig['size'], dimensions: ShedDimensions): RoofConfig => {
  const { width, height, depth } = dimensions;
  
  switch (size) {
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

export const getWindowPositions = (
  windows: ShedConfig['windows'],
  dimensions: ShedDimensions
): WindowPosition[] => {
  const { width, height, depth } = dimensions;
  const windowY = height * 0.3;

  switch (windows) {
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