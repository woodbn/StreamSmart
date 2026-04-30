import { Play, Info, Sparkles, Star } from 'lucide-react';

interface HeroSectionProps {
  onAskAI: () => void;
  onViewReviews: () => void;
  onPlay: () => void;
}

export function HeroSection({ onAskAI, onViewReviews, onPlay }: HeroSectionProps) {
  return (
    <div className="relative h-[80vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
      <img
        src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="relative z-20 px-8 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">NEW</span>
          <span className="text-sm text-gray-300">AI Recommended for you</span>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold">8.9</span>
            <button 
              onClick={onViewReviews}
              className="text-xs text-gray-400 hover:text-white ml-1 underline"
            >
              2.4k reviews
            </button>
          </div>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold mb-4">Avengers</h2>
        <p className="text-lg mb-6 text-gray-200">
          A brilliant team of scientists must pull off the impossible: steal a technology
          that could reshape reality itself before it falls into the wrong hands.
        </p>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={onPlay}
            className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded hover:bg-gray-200 transition font-semibold"
          >
            <Play className="w-5 h-5" fill="currentColor" />
            Play
          </button>
          <button className="flex items-center gap-2 bg-gray-500/70 text-white px-8 py-3 rounded hover:bg-gray-500/50 transition font-semibold">
            <Info className="w-5 h-5" />
            More Info
          </button>
          <button 
            onClick={onViewReviews}
            className="flex items-center gap-2 bg-yellow-600/80 text-white px-8 py-3 rounded hover:bg-yellow-600 transition font-semibold"
          >
            <Star className="w-5 h-5" />
            Reviews
          </button>
          <button 
            onClick={onAskAI}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded hover:from-purple-700 hover:to-pink-700 transition font-semibold"
          >
            <Sparkles className="w-5 h-5" />
            Ask AI About This
          </button>
        </div>
      </div>
    </div>
  );
}
