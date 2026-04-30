import { ChevronLeft, ChevronRight, Plus, Play, Star } from 'lucide-react';
import { useRef, useState } from 'react';

interface Movie {
  id: number;
  title: string;
  image: string;
  rating?: number;
  mood?: string;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieSelect: (movieTitle: string) => void;
  onWatchMovie: (movie: Movie) => void;
}

export function MovieRow({ title, movies, onMovieSelect, onWatchMovie }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="group">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-48 cursor-pointer transition-transform hover:scale-105 relative"
              onMouseEnter={() => setHoveredMovie(movie.id)}
              onMouseLeave={() => setHoveredMovie(null)}
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-72 object-cover rounded"
              />
              
              {/* Hover overlay with AI insights */}
              {hoveredMovie === movie.id && (
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent rounded flex flex-col justify-end p-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{movie.rating}</span>
                    {movie.mood && (
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-auto">
                        {movie.mood}
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold mb-3 text-sm">{movie.title}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onWatchMovie(movie)}
                      className="flex-1 bg-white text-black rounded px-2 py-1.5 flex items-center justify-center gap-1 hover:bg-gray-200 transition text-xs"
                    >
                      <Play className="w-3 h-3" fill="currentColor" />
                      Play
                    </button>
                    <button className="bg-zinc-700 hover:bg-zinc-600 rounded p-1.5 transition">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onMovieSelect(movie.title)}
                      className="bg-zinc-700 hover:bg-zinc-600 rounded p-1.5 transition"
                      title="View reviews"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Click star to see reviews</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
