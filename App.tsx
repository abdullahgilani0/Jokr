import React, { useState, useEffect } from 'react';
import { SettingsPanel } from './components/SettingsPanel';
import { JokeDisplay } from './components/JokeDisplay';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryRow } from './components/CategoryRow';
import { fetchJoke } from './services/jokeService';
import { generateJokeImage } from './services/geminiService';
import { JokeData, JokeSettings, JokeCategory } from './types';

// Neon/Comic Color Palette
const CATEGORY_COLORS: Record<string, string> = {
  [JokeCategory.Programming]: '#00f0ff', // Cyan
  [JokeCategory.Misc]: '#ffd700', // Gold
  [JokeCategory.Dark]: '#94a3b8', // Cool Grey
  [JokeCategory.Pun]: '#ff00ff', // Magenta
  [JokeCategory.Spooky]: '#bf5af2', // Purple
  [JokeCategory.Christmas]: '#ff3b30', // Red
  "Any": '#32d74b' // Green
};

const DEFAULT_SETTINGS: JokeSettings = {
  categories: [],
  blacklistFlags: ['nsfw', 'racist', 'sexist', 'explicit']
};

export default function App() {
  const [settings, setSettings] = useState<JokeSettings>(DEFAULT_SETTINGS);
  
  const [heroJoke, setHeroJoke] = useState<JokeData | null>(null);
  const [playerJoke, setPlayerJoke] = useState<JokeData | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchHero();
  }, [settings.blacklistFlags]);

  // Determine active theme color based on Hero or Player
  const activeCategory = playerJoke?.category || heroJoke?.category || "Any";
  const activeColor = CATEGORY_COLORS[activeCategory];

  const fetchHero = async () => {
    try {
      const joke = await fetchJoke({ ...settings, categories: [JokeCategory.Any] });
      setHeroJoke(joke);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePlayCategory = async (category: JokeCategory) => {
    setIsPlaying(true);
    setLoading(true);
    setGeneratedImage(null);
    try {
      const joke = await fetchJoke({ ...settings, categories: [category] });
      setPlayerJoke(joke);
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNextJoke = async () => {
    if (!playerJoke) return;
    setLoading(true);
    setGeneratedImage(null);
    try {
      const category = playerJoke.category;
      const joke = await fetchJoke({ ...settings, categories: [category] });
      setPlayerJoke(joke);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayHero = () => {
    if (heroJoke) {
      setPlayerJoke(heroJoke);
      setIsPlaying(true);
      setGeneratedImage(null);
    }
  };

  const handleGenerateImage = async () => {
    if (!playerJoke) return;
    
    setIsGeneratingImage(true);
    const jokeText = playerJoke.type === 'single' 
      ? playerJoke.joke! 
      : `${playerJoke.setup} ${playerJoke.delivery}`;
      
    const imageBase64 = await generateJokeImage(jokeText, playerJoke.category);
    setGeneratedImage(imageBase64);
    setIsGeneratingImage(false);
  };

  return (
    <div 
      className="min-h-screen font-sans text-gray-100 transition-colors duration-700 relative overflow-hidden"
      style={{ backgroundColor: '#0f172a' }} 
    >
      {/* Dynamic Background Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 transition-all duration-1000 pointer-events-none"
        style={{ backgroundColor: activeColor }}
      ></div>

      <Navbar 
        onSettingsClick={() => setIsSettingsOpen(true)} 
        scrolled={scrolled}
        accentColor={activeColor}
      />

      <div className={`relative z-10 transition-all duration-500 ${isPlaying ? 'blur-md opacity-50 pointer-events-none' : ''}`}>
        
        <Hero 
          joke={heroJoke} 
          onPlay={handlePlayHero}
          primaryColor={heroJoke ? CATEGORY_COLORS[heroJoke.category] : activeColor}
        />

        <div className="space-y-8 pb-20">
          <CategoryRow 
            title="Browse by Vibe" 
            categories={[JokeCategory.Programming, JokeCategory.Misc, JokeCategory.Dark]} 
            onSelectCategory={handlePlayCategory}
            colors={CATEGORY_COLORS}
          />
          
          <CategoryRow 
            title="More Categories" 
            categories={[JokeCategory.Pun, JokeCategory.Spooky, JokeCategory.Christmas]} 
            onSelectCategory={handlePlayCategory}
            colors={CATEGORY_COLORS}
          />
        </div>

        <div className="text-center mt-20 text-gray-500 font-comic">
           <p>© 2024 Jokr. Comic Sans is ironic here.</p>
        </div>
      </div>

      {/* Player Modal */}
      {isPlaying && (
        <JokeDisplay 
          joke={playerJoke}
          loading={loading}
          onNextJoke={handleNextJoke}
          onGenerateImage={handleGenerateImage}
          isGeneratingImage={isGeneratingImage}
          generatedImage={generatedImage}
          onClose={() => setIsPlaying(false)}
          primaryColor={playerJoke ? CATEGORY_COLORS[playerJoke.category] : activeColor}
        />
      )}

      {/* Settings Modal */}
      <SettingsPanel 
        settings={settings} 
        onUpdateSettings={setSettings} 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        themeColor={activeColor}
      />

    </div>
  );
}