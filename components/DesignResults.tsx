import React from 'react';
import { DesignData, SavedDesign } from '../types';
import { Palette, Sparkles, LayoutDashboard, ImageIcon, Download, BookmarkPlus, Trash2, Grid } from 'lucide-react';

interface DesignResultsProps {
  data: DesignData;
  imageUrl: string | null;
  onSave: () => void;
  gallery: SavedDesign[];
  onDelete: (id: string) => void;
}

const ColorSwatch = ({ color, label }: { color: string; label: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div 
      className="w-12 h-12 rounded-full border border-gray-200 shadow-sm" 
      style={{ backgroundColor: color }}
    />
    <span className="text-[10px] uppercase text-gray-500 font-mono tracking-wide">{label}</span>
  </div>
);

export const DesignResults: React.FC<DesignResultsProps> = ({ data, imageUrl, onSave, gallery, onDelete }) => {
  const [activeTab, setActiveTab] = React.useState<'details' | 'image' | 'gallery'>('details');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
       {/* Tabs */}
       <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'details' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Palette size={16} /> Details
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'image' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ImageIcon size={16} /> Concept
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'gallery' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Grid size={16} /> Gallery ({gallery.length})
        </button>
      </div>

      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
        {activeTab === 'details' && (
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Palette size={16} className="text-blue-500" />
                Color Palette
              </h3>
              <div className="flex flex-wrap gap-4 justify-between bg-gray-50 p-4 rounded-xl">
                <ColorSwatch color={data.palette.primaryColor} label="Primary" />
                <ColorSwatch color={data.palette.secondaryColor} label="Secondary" />
                <ColorSwatch color={data.palette.accentColor} label="Accent" />
                <ColorSwatch color={data.palette.wallColor} label="Walls" />
                <ColorSwatch color={data.palette.floorColor} label="Floor" />
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                Design Advice
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                {data.advice}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <LayoutDashboard size={16} className="text-green-500" />
                Layout Notes
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed bg-green-50/50 p-4 rounded-xl border border-green-100">
                {data.furnitureLayoutNotes}
              </p>
            </section>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="h-full flex flex-col items-center justify-center">
             {imageUrl ? (
               <div className="w-full flex flex-col gap-4">
                  <div className="relative group rounded-xl overflow-hidden shadow-md">
                    <img 
                      src={imageUrl} 
                      alt="AI Generated Concept" 
                      className="w-full object-cover"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                     <button 
                       onClick={onSave}
                       className="flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                     >
                       <BookmarkPlus size={16} /> Save to Gallery
                     </button>
                     <a 
                       href={imageUrl} 
                       download="dreamspace-concept.png"
                       className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                     >
                       <Download size={16} /> Download
                     </a>
                  </div>
                  
                  <p className="text-xs text-center text-gray-400 mt-2">Generated by Gemini 2.5 Flash Image</p>
               </div>
             ) : (
               <div className="text-center text-gray-400 py-10">
                 <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
                 <p className="text-sm">No concept image generated yet.</p>
               </div>
             )}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-4">
             {gallery.length === 0 ? (
               <div className="text-center text-gray-400 py-12 flex flex-col items-center">
                 <Grid size={48} className="mb-3 opacity-20" />
                 <p className="text-sm">Gallery is empty.</p>
                 <p className="text-xs opacity-70">Save your favorite designs to see them here.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 gap-4">
                 {gallery.map((item) => (
                   <div key={item.id} className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex gap-3 group">
                      <img 
                        src={item.imageUrl} 
                        alt="Saved Design" 
                        className="w-24 h-24 object-cover rounded-lg bg-gray-200"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                         <div>
                            <div className="flex justify-between items-start">
                               <h4 className="font-medium text-gray-900 text-sm truncate">{item.style} {item.roomType}</h4>
                               <button 
                                 onClick={() => onDelete(item.id)}
                                 className="text-gray-400 hover:text-red-500 transition-colors p-1"
                               >
                                 <Trash2 size={14} />
                               </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </p>
                         </div>
                         <div className="flex gap-1 mt-2">
                            <div className="w-4 h-4 rounded-full border border-gray-300" style={{background: item.palette.primaryColor}} />
                            <div className="w-4 h-4 rounded-full border border-gray-300" style={{background: item.palette.secondaryColor}} />
                            <div className="w-4 h-4 rounded-full border border-gray-300" style={{background: item.palette.accentColor}} />
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};