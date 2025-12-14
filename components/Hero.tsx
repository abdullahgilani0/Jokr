import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { JokeData, JokeCategory } from '../types';

interface HeroProps {
  joke: JokeData | null;
  onPlay: () => void;
  primaryColor: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  [JokeCategory.Programming]: '💻',
  [JokeCategory.Misc]: '🎲',
  [JokeCategory.Dark]: '🌑',
  [JokeCategory.Pun]: '🤡',
  [JokeCategory.Spooky]: '👻',
  [JokeCategory.Christmas]: '🎄',
  "Any": '✨'
};

export const Hero: React.FC<HeroProps> = ({ joke, onPlay, primaryColor }) => {
  const categoryIcon = joke ? CATEGORY_ICONS[joke.category] || '✨' : '...';

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pt-28 pb-12">
      <div className="bg-jokr-card rounded-3xl border-2 border-black shadow-comic overflow-hidden flex flex-col md:flex-row relative group">
        
        {/* Decorative dots pattern */}
        <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: `radial-gradient(${primaryColor} 2px, transparent 2px)`, 
            backgroundSize: '20px 20px' 
        }}></div>

        {/* Left Content */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center items-start z-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white text-black transform -rotate-1">
             <span>{joke?.category || 'Loading...'}</span>
             <span>{categoryIcon}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-comic font-bold text-white mb-6 leading-tight drop-shadow-md">
            {joke 
              ? (joke.type === 'single' ? joke.joke : joke.setup) 
              : "Fetching the finest humor..."}
          </h1>

          <div className="flex gap-4 mt-6">
             <button 
               onClick={onPlay}
               disabled={!joke}
               className="flex items-center gap-3 px-8 py-4 rounded-xl text-black font-display tracking-wide text-xl border-2 border-black shadow-comic hover:shadow-comic-hover hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
               style={{ backgroundColor: primaryColor }}
             >
               <Play fill="currentColor" size={24} />
               READ COMIC
             </button>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="hidden md:flex w-1/3 bg-jokr-dark relative items-center justify-center border-l-2 border-black overflow-hidden">
           <div className="absolute inset-0 bg-black/20 z-0"></div>
           
           <div className="relative z-10 text-center p-6 transform transition-transform group-hover:scale-110 duration-500">
              <div className="text-9xl mb-4 animate-bounce-sm filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] grayscale group-hover:grayscale-0 transition-all duration-500">
                {categoryIcon}
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-jokr-card border border-white/10 rounded-full text-sm font-bold text-gray-300">
                <Sparkles size={16} style={{ color: primaryColor }}/>
                <span>Daily Feature</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};