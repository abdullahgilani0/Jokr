import React, { useState, useEffect } from 'react';
import { JokeData, JokeType } from '../types';
import { Wand2, X, ChevronDown, SkipForward, ImageIcon, Copy, Share2 } from 'lucide-react';

interface JokePlayerProps {
  joke: JokeData | null;
  loading: boolean;
  onNextJoke: () => void;
  onGenerateImage: () => void;
  isGeneratingImage: boolean;
  generatedImage: string | null;
  onClose: () => void;
  primaryColor: string;
}

export const JokeDisplay: React.FC<JokePlayerProps> = ({ 
  joke, 
  loading, 
  onNextJoke,
  onGenerateImage,
  isGeneratingImage,
  generatedImage,
  onClose,
  primaryColor
}) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
  }, [joke]);

  const handleReveal = () => setRevealed(true);
  
  const handleCopy = () => {
      if(joke) {
          const text = joke.type === 'single' ? joke.joke : `${joke.setup}\n\n${joke.delivery}`;
          navigator.clipboard.writeText(text || "");
      }
  }

  const handleShare = async () => {
    if (!joke) return;

    const text = joke.type === 'single' ? joke.joke : `${joke.setup}\n\n${joke.delivery}`;
    const shareData: ShareData = {
        title: 'Jokr - Comic Humor',
        text: `${text}\n\nShared via Jokr App`,
    };

    if (generatedImage) {
        try {
            const response = await fetch(generatedImage);
            const blob = await response.blob();
            const file = new File([blob], 'joke-comic.png', { type: blob.type });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                shareData.files = [file];
            }
        } catch (e) {
            console.error("Error preparing image for share", e);
        }
    }

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            handleCopy();
            alert("Copied to clipboard!");
        }
    } catch (e) {
        console.error("Share failed", e);
    }
  };

  const isTwoPart = joke?.type === JokeType.TwoPart;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-6xl bg-jokr-card rounded-2xl shadow-2xl border-4 border-black overflow-hidden flex flex-col md:flex-row min-h-[650px] animate-pop">
        
        {/* Left Side: Joke Text (Panel 1) */}
        <div className="flex-1 p-8 md:p-12 flex flex-col relative bg-jokr-card z-10">
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 md:left-8 p-2 rounded-full hover:bg-white/10 text-gray-400 transition-colors"
          >
            <X size={28} />
          </button>

          <div className="flex-1 flex flex-col justify-center mt-12 md:mt-0 space-y-8">
            {loading ? (
                <div className="space-y-6 animate-pulse">
                    <div className="h-6 bg-white/10 rounded w-1/4 mb-4"></div>
                    <div className="h-12 bg-white/10 rounded w-full"></div>
                    <div className="h-12 bg-white/10 rounded w-2/3"></div>
                </div>
            ) : joke ? (
                <>
                    <div className="inline-block self-start px-4 py-1 border-2 border-black bg-white text-black font-display tracking-wider text-sm transform -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {joke.category}
                    </div>
                    
                    {/* Speech Bubble Style Container */}
                    <div className="relative bg-white text-black p-8 rounded-[2rem] rounded-bl-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] transform rotate-1">
                        <h2 className="text-3xl md:text-4xl font-comic font-bold leading-tight">
                            {isTwoPart ? joke.setup : joke.joke}
                        </h2>
                    </div>

                    {isTwoPart && (
                        <div className={`transition-all duration-500 transform ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            {revealed && (
                                <div 
                                  className="relative mt-4 bg-black text-white p-8 rounded-[2rem] rounded-tr-none border-4 border-white/20 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] -rotate-1 animate-pop"
                                  style={{ borderColor: primaryColor }}
                                >
                                    <p className="text-2xl md:text-4xl font-display tracking-wide" style={{ color: primaryColor }}>
                                        {joke.delivery}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center text-gray-400 font-comic">Something went wrong.</div>
            )}
          </div>

          {/* Comic Controls */}
          <div className="mt-12 flex flex-wrap gap-4 items-center pt-8 border-t border-white/10">
             {isTwoPart && !revealed && (
                 <button 
                   onClick={handleReveal}
                   className="flex-1 px-6 py-4 bg-white text-black text-xl font-display tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                 >
                    <ChevronDown size={24} />
                    REVEAL PUNCHLINE
                 </button>
             )}
             
             <button 
                onClick={onNextJoke}
                className={`px-6 py-4 rounded-xl font-display tracking-wider text-lg border-2 border-white/20 hover:border-white text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 ${!isTwoPart || revealed ? 'flex-1' : ''}`}
             >
                <SkipForward size={24} />
                NEXT COMIC
             </button>

             {(revealed || !isTwoPart) && (
                 <button 
                    onClick={onGenerateImage}
                    disabled={isGeneratingImage || !!generatedImage}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border-2 border-white/10 text-white transition-colors disabled:opacity-50 disabled:cursor-default"
                    title="Generate Comic Panel"
                    style={{ color: primaryColor, borderColor: isGeneratingImage ? primaryColor : undefined }}
                 >
                    {isGeneratingImage ? <Wand2 className="animate-spin" size={24}/> : <Wand2 size={24} />}
                 </button>
             )}

             <button onClick={handleShare} className="p-4 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors" title="Share Joke">
                <Share2 size={24} />
             </button>

             <button onClick={handleCopy} className="p-4 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors" title="Copy Text">
                <Copy size={24} />
             </button>
          </div>
        </div>

        {/* Right Side: Comic Panel Visualization */}
        <div className="w-full md:w-[50%] bg-black relative flex items-center justify-center p-2 md:p-0 overflow-hidden">
            {/* Halftone Pattern */}
            <div className="absolute inset-0 opacity-20" style={{ 
               backgroundImage: `radial-gradient(circle, ${primaryColor} 2px, transparent 2.5px)`, 
               backgroundSize: '16px 16px' 
            }}></div>

            {generatedImage ? (
                <div className="relative w-full h-full animate-slide-in">
                    <img src={generatedImage} alt="Comic Panel" className="w-full h-full object-contain md:object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center p-8">
                        <a 
                          href={generatedImage} 
                          download="jokr-comic.png" 
                          className="px-8 py-3 bg-white text-black font-display text-xl rounded shadow-lg transform hover:scale-105 transition-all border-2 border-black"
                        >
                            SAVE COMIC
                        </a>
                    </div>
                </div>
            ) : (
                <div className="text-center p-12 max-w-md relative z-10">
                    <div 
                      className="w-24 h-24 mx-auto bg-jokr-card rounded-full border-4 border-black shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center mb-8"
                      style={{ borderColor: primaryColor }}
                    >
                        {isGeneratingImage ? <Wand2 className="animate-spin text-white" size={40} /> : <ImageIcon className="text-white" size={40} />}
                    </div>
                    <h3 className="font-display text-3xl text-white mb-4 tracking-wide">
                        {isGeneratingImage ? "DRAWING COMIC..." : "VISUALIZE THIS SCENE"}
                    </h3>
                    <p className="text-gray-400 font-comic text-lg leading-relaxed">
                        {isGeneratingImage 
                          ? "Our AI artist is sketching the characters and adding speech bubbles..."
                          : "Tap the magic wand to turn this text into a fully illustrated comic panel."}
                    </p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};