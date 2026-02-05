
export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  resultUrl?: string;
  error?: string;
}

export enum LifestylePreset {
  SCANDINAVIAN = 'In a bright, airy Scandinavian living room with light wood furniture and soft textures',
  MINIMALIST_ZEN = 'In a minimalist zen space with natural stone, bamboo, and soft indirect lighting',
  INDUSTRIAL_LOFT = 'In a modern industrial loft with exposed brick, metal accents, and warm Edison bulbs',
  MODERN_KITCHEN = 'On a white marble kitchen island with high-end appliances and fresh herbs in the background',
  NATURE_OUTDOOR = 'On a rustic wooden table outdoors with blurred green forest and soft sunlight bokeh',
  LUXURY_STUDIO = 'In a high-end luxury studio setting with dramatic shadows and premium velvet textures',
  BOHEMIAN_CHIC = 'In a cozy bohemian room with plants, macrame, and warm sunbeams',
  TECH_OFFICE = 'On a clean white desk in a high-tech office with a blurred city skyline view'
}

export interface GenerationSettings {
  preset: LifestylePreset | string;
  customPrompt: string;
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
}
