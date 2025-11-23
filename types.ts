export enum JewelryStyle {
  INDIAN_COMMERCIAL = 'Indian Commercial',
  CATALOG_ECOMMERCE = 'Catalog/E-commerce',
  HIGH_FASHION = 'High-Fashion',
}

export interface StyleConfig {
  name: JewelryStyle;
  directives: string;
  focalPlane: string;
  lightingSetup: string;
  dofInstruction: string;
  cameraLens: string;
  backgroundStaging: string;
  colorGrading: string;
  modelDescription: string;
  tone: string; // Emotional Tone mapped from prompt logic
}

export interface JewelryFormData {
  category: string;
  materialDetails: string;
  dimensions: string;
  style: JewelryStyle;
  referenceImage: File | null;
  referenceImagePreview: string | null;
}

export interface PromptParts {
  subject: string;
  photography: string;
  environment: string;
  model: string;
  finalTouches: string;
}
