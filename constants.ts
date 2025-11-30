import { RoomType, DesignStyle, DesignPalette } from './types';

export const DEFAULT_DIMENSIONS = {
  width: 5,
  depth: 4,
  height: 2.8
};

export const DEFAULT_PALETTE: DesignPalette = {
  primaryColor: '#e2e8f0', // slate-200
  secondaryColor: '#94a3b8', // slate-400
  accentColor: '#3b82f6', // blue-500
  floorColor: '#d6bcfa', // wood-ish tint placeholder
  wallColor: '#f8fafc' // slate-50
};

export const ROOM_TYPES = Object.values(RoomType);
export const DESIGN_STYLES = Object.values(DesignStyle);