import React from 'react';
import { Smile, Settings } from 'lucide-react';

interface NavbarProps {
  onSettingsClick: () => void;
  scrolled: boolean;
  accentColor: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onSettingsClick, scrolled, accentColor }) => {
  return (
    <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-jokr-bg/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer select-none">
          <div 
            className="p-2 rounded-lg text-black transition-transform group-hover:rotate-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]" 
            style={{ backgroundColor: accentColor }}
          >
            <Smile size={24} strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-display tracking-wider text-white drop-shadow-lg">
            Jokr
          </h1>
        </div>

        <button 
          onClick={onSettingsClick}
          className="p-3 bg-jokr-card hover:bg-white/10 rounded-xl border-2 border-transparent hover:border-white/20 transition-all active:scale-95"
        >
          <Settings size={22} className="text-gray-300" />
        </button>
      </div>
    </nav>
  );
};