import React from 'react';
import { JokeCategory, JokeFlags, JokeSettings } from '../types';
import { X, Check } from 'lucide-react';

interface SettingsPanelProps {
  settings: JokeSettings;
  onUpdateSettings: (newSettings: JokeSettings) => void;
  isOpen: boolean;
  onClose: () => void;
  themeColor: string;
}

const ALL_CATEGORIES = [
  JokeCategory.Programming,
  JokeCategory.Misc,
  JokeCategory.Dark,
  JokeCategory.Pun,
  JokeCategory.Spooky,
  JokeCategory.Christmas,
];

const ALL_FLAGS: (keyof JokeFlags)[] = [
  'nsfw',
  'religious',
  'political',
  'racist',
  'sexist',
  'explicit',
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  onUpdateSettings, 
  isOpen, 
  onClose,
  themeColor
}) => {
  if (!isOpen) return null;

  const toggleCategory = (cat: JokeCategory) => {
    const newCategories = settings.categories.includes(cat)
      ? settings.categories.filter(c => c !== cat)
      : [...settings.categories, cat];
    onUpdateSettings({ ...settings, categories: newCategories });
  };

  const toggleFlag = (flag: keyof JokeFlags) => {
    const newFlags = settings.blacklistFlags.includes(flag)
      ? settings.blacklistFlags.filter(f => f !== flag)
      : [...settings.blacklistFlags, flag];
    onUpdateSettings({ ...settings, blacklistFlags: newFlags });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-jokr-card rounded-2xl border-2 border-white/10 shadow-2xl w-full max-w-md overflow-hidden relative transform transition-all animate-scale-up">
        
        <div className="p-6 border-b border-white/5 flex justify-between items-center" style={{ backgroundColor: `${themeColor}20` }}>
          <h2 className="text-2xl font-display tracking-wide text-white">Joke Preferences</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Categories</h3>
            <div className="flex flex-wrap gap-3">
              {ALL_CATEGORIES.map(cat => {
                const isSelected = settings.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold font-comic transition-all duration-200 border-2 ${
                      isSelected 
                        ? `border-transparent text-black shadow-[0_0_10px_rgba(0,0,0,0.5)]` 
                        : 'bg-jokr-dark border-white/10 text-gray-400 hover:border-white/30'
                    }`}
                    style={{ backgroundColor: isSelected ? themeColor : undefined }}
                  >
                    {cat}
                    {isSelected && <Check size={14} className="inline ml-1" />}
                  </button>
                );
              })}
            </div>
            {settings.categories.length === 0 && (
              <p className="text-xs text-yellow-500 mt-2 font-comic">Selecting none defaults to "Any".</p>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Blacklist (Exclude)</h3>
            <div className="grid grid-cols-2 gap-3">
              {ALL_FLAGS.map(flag => {
                const isSelected = settings.blacklistFlags.includes(flag);
                return (
                  <label key={flag} className="flex items-center space-x-3 cursor-pointer group p-2 rounded hover:bg-white/5 transition-colors">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                       isSelected ? 'bg-red-500 border-red-500 text-white' : 'border-gray-600 bg-jokr-dark group-hover:border-red-400'
                    }`}>
                      {isSelected && <Check size={12} strokeWidth={4} />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isSelected} 
                      onChange={() => toggleFlag(flag)} 
                    />
                    <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                      {flag.charAt(0).toUpperCase() + flag.slice(1)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>
        
        <div className="p-4 border-t border-white/5 bg-jokr-dark/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 rounded-xl text-black font-display tracking-wider shadow-lg transform active:scale-95 transition-all hover:brightness-110"
            style={{ backgroundColor: themeColor }}
          >
            SAVE CHANGES
          </button>
        </div>

      </div>
    </div>
  );
};