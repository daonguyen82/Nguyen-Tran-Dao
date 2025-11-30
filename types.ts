export enum RoomType {
  LIVING_ROOM = 'Living Room',
  BEDROOM = 'Bedroom',
  KITCHEN = 'Kitchen',
  OFFICE = 'Office',
  BATHROOM = 'Bathroom'
}

export enum DesignStyle {
  MODERN = 'Modern',
  MINIMALIST = 'Minimalist',
  SCANDINAVIAN = 'Scandinavian',
  INDUSTRIAL = 'Industrial',
  CLASSIC = 'Classic',
  BOHEMIAN = 'Bohemian'
}

export interface RoomDimensions {
  width: number; // meters
  depth: number; // meters
  height: number; // meters
}

export interface DesignPalette {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  floorColor: string;
  wallColor: string;
}

export interface LightingConfig {
  intensity: number;
  warmth: number; // 0 (Cool/White) to 1 (Warm/Orange)
}

export interface SavedDesign {
  id: string;
  timestamp: number;
  roomType: RoomType;
  style: DesignStyle;
  imageUrl: string;
  palette: DesignPalette;
}

export interface DesignData {
  palette: DesignPalette;
  advice: string;
  furnitureLayoutNotes: string;
}

export interface DesignRequest {
  roomType: RoomType;
  style: DesignStyle;
  dimensions: RoomDimensions;
  budget?: string;
}