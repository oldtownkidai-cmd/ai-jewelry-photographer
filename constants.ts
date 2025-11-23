import { JewelryStyle, StyleConfig } from './types';

export const STYLE_CONFIGS: Record<JewelryStyle, StyleConfig> = {
  [JewelryStyle.INDIAN_COMMERCIAL]: {
    name: JewelryStyle.INDIAN_COMMERCIAL,
    directives: 'Indian Commercial Directives',
    focalPlane: 'Macro/Close-up',
    lightingSetup: 'Hard studio lighting to maximize gold sheen and diamond sparkle',
    dofInstruction: 'Shallow DoF to isolate the product',
    cameraLens: 'Hasselblad H6D with a 120mm Macro lens, f/11',
    backgroundStaging: 'Staged on rich, textured red velvet or an intricate traditional textile',
    colorGrading: 'Warm and highly saturated',
    modelDescription: 'Not applicable',
    tone: 'Luxurious, Traditional, and Opulent',
  },
  [JewelryStyle.CATALOG_ECOMMERCE]: {
    name: JewelryStyle.CATALOG_ECOMMERCE,
    directives: 'Catalog/E-commerce Directives',
    focalPlane: 'Macro, 1:1 ratio',
    lightingSetup: 'Soft, diffused box lighting from 4 points to eliminate harsh shadows',
    dofInstruction: 'Deep DoF (everything in focus)',
    cameraLens: 'Canon R5 with a 100mm Macro lens, f/16',
    backgroundStaging: 'Pure white, seamless background (RGB 255, 255, 255)',
    colorGrading: 'Neutral and True-to-life',
    modelDescription: 'Not applicable',
    tone: 'Clean, Professional, and Trustworthy',
  },
  [JewelryStyle.HIGH_FASHION]: {
    name: JewelryStyle.HIGH_FASHION,
    directives: 'High-Fashion Model Directives',
    focalPlane: "Close-up on the model's hand/finger",
    lightingSetup: 'Dramatic, directional lighting (key light and rim light) to create sharp contrast',
    dofInstruction: 'Very Shallow DoF to blur the background',
    cameraLens: 'Phase One XF with a 80mm lens, f/2.8',
    backgroundStaging: 'Set against an abstract, minimalist architectural background or soft-focus silk fabric',
    colorGrading: 'Cool and Desaturated (Vogue/Editorial aesthetic)',
    modelDescription: 'Slender, elegant hand, impeccably manicured nails, graceful, editorial pose',
    tone: 'Avant-garde, Sophisticated, and Moody',
  },
};

export const MASTER_TEMPLATE = {
  FINAL_TOUCHES: 'Masterpiece quality, 8k resolution, high detail, perfectly polished.',
};
