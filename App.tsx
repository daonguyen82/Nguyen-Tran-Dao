import React, { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { Room3D } from './components/Room3D';
import { DesignResults } from './components/DesignResults';
import { DesignRequest, DesignData, DesignPalette, LightingConfig, SavedDesign } from './types';
import { DEFAULT_DIMENSIONS, DEFAULT_PALETTE } from './constants';
import { generateDesignData, generateConceptImage } from './services/geminiService';
import { Layout } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  
  // Design State
  const [designRequest, setDesignRequest] = useState<DesignRequest>({
    roomType: 'Living Room' as any,
    style: 'Modern' as any,
    dimensions: DEFAULT_DIMENSIONS,
  });
  
  const [designData, setDesignData] = useState<DesignData>({
    palette: DEFAULT_PALETTE,
    advice: "Generate a design to see AI recommendations.",
    furnitureLayoutNotes: "Standard layout applied."
  });
  
  const [conceptImage, setConceptImage] = useState<string | null>(null);

  // New Features State
  const [lighting, setLighting] = useState<LightingConfig>({ intensity: 1.2, warmth: 0.2 });
  const [gallery, setGallery] = useState<SavedDesign[]>([]);

  const handleGenerate = async (request: DesignRequest) => {
    setLoading(true);
    setDesignRequest(request);
    
    // Optimizing API Integration: Parallel execution
    try {
      const [data, image] = await Promise.all([
        generateDesignData(request),
        generateConceptImage(request)
      ]);
      
      setDesignData(data);
      setConceptImage(image);
    } catch (error) {
      console.error("Failed to generate design:", error);
      alert("Something went wrong while generating the design. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePalette = (key: keyof DesignPalette, color: string) => {
    setDesignData(prev => ({
      ...prev,
      palette: {
        ...prev.palette,
        [key]: color
      }
    }));
  };

  const handleSaveDesign = () => {
    if (!conceptImage) return;
    
    const newDesign: SavedDesign = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      roomType: designRequest.roomType,
      style: designRequest.style,
      imageUrl: conceptImage,
      palette: { ...designData.palette }
    };
    
    setGallery(prev => [newDesign, ...prev]);
  };

  const handleDeleteDesign = (id: string) => {
    setGallery(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
           <Layout className="text-blue-600" />
           <h1 className="text-xl font-bold tracking-tight text-slate-800">DreamSpace <span className="text-blue-600">AI</span></h1>
        </div>
        <div className="text-xs font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-500">
           Powered by Google Gemini
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Controls & Results */}
        <div className="lg:col-span-3 flex flex-col gap-6 h-[800px] lg:h-auto">
          <div className="flex-shrink-0">
             <ControlPanel 
                isLoading={loading} 
                onGenerate={handleGenerate}
                currentPalette={designData.palette}
                onUpdatePalette={handleUpdatePalette}
                lighting={lighting}
                onUpdateLighting={setLighting}
             />
          </div>
          <div className="flex-1 min-h-0">
             <DesignResults 
                data={designData} 
                imageUrl={conceptImage} 
                onSave={handleSaveDesign}
                gallery={gallery}
                onDelete={handleDeleteDesign}
             />
          </div>
        </div>

        {/* Right Column: 3D Visualization */}
        <div className="lg:col-span-9 h-[500px] lg:h-auto flex flex-col">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex-1 relative">
            <Room3D 
              dimensions={designRequest.dimensions}
              palette={designData.palette}
              roomType={designRequest.roomType}
              lighting={lighting}
            />
            
            {/* Overlay Title */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-100 pointer-events-none">
              <h2 className="text-sm font-semibold text-gray-800">{designRequest.style} {designRequest.roomType}</h2>
              <p className="text-xs text-gray-500">{designRequest.dimensions.width}m x {designRequest.dimensions.depth}m</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}