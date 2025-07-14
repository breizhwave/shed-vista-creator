import { RoofConfig, ShedDimensions } from '../types/shed';

export const calculatePlankHeight = (
  zPosition: number,
  dimensions: ShedDimensions,
  roofConfig: RoofConfig,
  isBackWall: boolean = false
): number => {
  const { height, depth } = dimensions;
  const baseHeight = height;
  const roofSlope = Math.tan(roofConfig.roofAngle);
  const distanceFromCenter = Math.abs(zPosition);
  const maxDistanceFromCenter = depth / 2;
  
  // Calculate how much to add based on distance from edge and roof slope
  // Planks are tallest at center (z=0) and shortest at edges (z=±depth/2)
  const heightAddition = (maxDistanceFromCenter - distanceFromCenter) * roofSlope * 0.8;
  
  return Math.max(baseHeight + heightAddition, baseHeight * 0.8); // Minimum 80% of base height
};

export const calculateTriangleCapHeight = (
  zPosition: number,
  dimensions: ShedDimensions,
  roofConfig: RoofConfig
): number => {
  const { height, depth } = dimensions;
  const roofSlope = Math.tan(roofConfig.roofAngle);
  const distanceFromCenter = Math.abs(zPosition);
  const maxDistanceFromCenter = depth / 2;
  
  // Height difference between plank top and roof at this position
  const roofHeightAtPosition = roofConfig.roofY + roofConfig.slopeY + (maxDistanceFromCenter - distanceFromCenter) * roofSlope * 0.3;
  const plankHeight = calculatePlankHeight(zPosition, dimensions, roofConfig);
  const plankTopY = height / 2 + (plankHeight - height) / 2 + plankHeight / 2;
  
  return Math.max(roofHeightAtPosition - plankTopY, 0.05); // Minimum cap height
};