import React, { useState } from 'react';
import { RoomType, DesignStyle, DesignRequest, RoomDimensions, DesignPalette, LightingConfig } from '../types';
import { ROOM_TYPES, DESIGN_STYLES, DEFAULT_DIMENSIONS } from '../constants';
import { Wand2, SlidersHorizontal, Sun, Palette } from 'lucide-react';

interface ControlPanelProps {
  isLoading: boolean;
  onGenerate: (request: DesignRequest) => void;
  currentPalette: DesignPalette;
  onUpdatePalette: (key: keyof DesignPalette, color: string) => void;
  lighting: LightingConfig;
  onUpdateLighting: (config: LightingConfig) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  isLoading, 
  onGenerate, 
  currentPalette, 
  onUpdatePalette,
  lighting,
  onUpdateLighting
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'edit'>('generate');
  
  // Form State
  const [roomType, setRoomType] = React.useState<RoomType>(RoomType.LIVING_ROOM);
  const [style, setStyle] = React.useState<DesignStyle>(DesignStyle.MODERN);
  const [dimensions, setDimensions] = React.useState<RoomDimensions>(DEFAULT_DIMENSIONS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ roomType, style, dimensions });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-full flex flex-col overflow-hidden">
       {/* Panel Header/Tabs */}
       <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('generate')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'generate' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Wand2 size={16} /> Generate
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'edit' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <SlidersHorizontal size={16} /> Edit Scene
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'generate' ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-full">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <div className="grid grid-cols-2 gap-2">
                {ROOM_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRoomType(type as RoomType)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                      roomType === type
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Design Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as DesignStyle)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                {DESIGN_STYLES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width (m)</label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  step="0.5"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Depth (m)</label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  step="0.5"
                  value={dimensions.depth}
                  onChange={(e) => setDimensions({ ...dimensions, depth: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="mt-auto pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 px-4 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-[0.98]'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Designing...
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    Generate Design
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Color Editor */}
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Palette size={16} className="text-blue-500" />
                Edit Colors
              </h3>
              <div className="space-y-3">
                {Object.entries(currentPalette).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between group">
                    <span className="text-xs text-gray-600 capitalize font-medium">
                      {key.replace('Color', '')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 font-mono hidden group-hover:block">{value}</span>
                      <div className="relative overflow-hidden w-16 h-8 rounded-lg border border-gray-200 shadow-sm">
                        <input 
                          type="color" 
                          value={value} 
                          onChange={(e) => onUpdatePalette(key as keyof DesignPalette, e.target.value)}
                          className="absolute -top-2 -left-2 w-24 h-16 p-0 border-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Lighting Editor */}
            <section>
               <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sun size={16} className="text-amber-500" />
                Lighting Control
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-600">Brightness</span>
                    <span className="text-xs text-gray-400">{Math.round(lighting.intensity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    value={lighting.intensity}
                    onChange={(e) => onUpdateLighting({ ...lighting, intensity: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div>
                   <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-600">Warmth</span>
                    <span className="text-xs text-gray-400">{Math.round(lighting.warmth * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={lighting.warmth}
                    onChange={(e) => onUpdateLighting({ ...lighting, warmth: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gradient-to-r from-blue-100 to-orange-300 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};