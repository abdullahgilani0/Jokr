import React from 'react';
import { JokeCategory } from '../types';
import { ArrowRight } from 'lucide-react';

interface CategoryRowProps {
  title: string;
  categories: JokeCategory[];
  onSelectCategory: (cat: JokeCategory) => void;
  colors: Record<string, string>;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({ title, categories, onSelectCategory, colors }) => {
  return (
    <div className="mb-4 max-w-7xl mx-auto px-6">
      <h2 className="text-3xl font-display text-white mb-6 flex items-center gap-2 tracking-wide">
        {title}
        <ArrowRight size={24} className="text-gray-600" />
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat) => {
          const color = colors[cat] || '#6366f1';
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className="group relative aspect-square rounded-xl p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 bg-jokr-card border-2 border-transparent hover:border-white/20"
              style={{ boxShadow: `0 4px 0 0 ${color}` }}
            >
               <div className="w-12 h-12 rounded-full flex items-center justify-center bg-jokr-dark border border-white/10 group-hover:border-white/30 transition-colors">
                 <div className="w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: color, color: color }}></div>
               </div>

               <div className="text-left z-10">
                 <p className="font-comic font-bold text-xl text-white group-hover:text-transparent group-hover:bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, #fff, ${color})` }}>{cat}</p>
                 <p className="text-xs text-gray-400 font-medium mt-1 group-hover:text-white transition-colors">Read Comics &rarr;</p>
               </div>
               
               {/* Hover Glow */}
               <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
                  style={{ backgroundColor: color }}
               ></div>
            </button>
          );
        })}
      </div>
    </div>
  );
};