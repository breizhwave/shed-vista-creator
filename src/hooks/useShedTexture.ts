import { useLoader } from '@react-three/fiber';
import { TextureLoader, Texture } from 'three';

export const useShedTexture = (): Texture => {
  // const woodTexture = useLoader(TextureLoader, '/lovable-uploads/cfe6db52-b186-418f-b439-e440ab516521.png');
  const woodTexture = useLoader(TextureLoader, '/i/concept-de-papier-peint-motif-bois-texture.jpg');

  // Configure texture for wood planks
  woodTexture.wrapS = woodTexture.wrapT = 200; // RepeatWrapping
  woodTexture.repeat.set(1, 1); // Repeat vertically for plank effect
  
  return woodTexture;
};