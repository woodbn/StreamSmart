import { useEffect, useState } from 'react';
import { ArrowLeft, Maximize2, MessageCircle, Pause, Play, RotateCcw, Volume2, X } from 'lucide-react';

export interface WatchMovie {
  title: string;
  image: string;
}

interface WatchPageProps {
  movie: WatchMovie;
  onBack: () => void;
  onPostAboutMovie: (movie: WatchMovie) => void;
}

export function WatchPage({ movie, onBack, onPostAboutMovie }: WatchPageProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showEndPrompt, setShowEndPrompt] = useState(false);

  useEffect(() => {
    setProgress(0);
    setIsPlaying(true);
    setShowEndPrompt(false);
  }, [movie.title]);

  useEffect(() => {
    if (!isPlaying || showEndPrompt) return;

    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 0.4, 100);
        if (next >= 100) {
          window.clearInterval(timer);
          setIsPlaying(false);
          setShowEndPrompt(true);
        }
        return next;
      });
    }, 100);

    return () => window.clearInterval(timer);
  }, [isPlaying, showEndPrompt]);

  const restartMovie = () => {
    setProgress(0);
    setShowEndPrompt(false);
    setIsPlaying(true);
  };

  const finishMovie = () => {
    setProgress(100);
    setIsPlaying(false);
    setShowEndPrompt(true);
  };

  const seekMovie = (nextProgress: number) => {
    setProgress(nextProgress);
    if (nextProgress >= 100) {
      setIsPlaying(false);
      setShowEndPrompt(true);
      return;
    }

    setShowEndPrompt(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative min-h-screen overflow-hidden">
        <img
          src={movie.image}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black" />

        <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-md bg-black/50 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-black/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={onBack}
            className="rounded-full bg-black/50 p-2 backdrop-blur transition hover:bg-black/70"
            aria-label="Close player"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <main className="relative z-10 flex min-h-[calc(100vh-88px)] flex-col justify-end px-6 pb-8 sm:px-8">
          <div className="mb-auto mt-24 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-red-300">Now watching</p>
            <h1 className="text-4xl font-bold sm:text-6xl">{movie.title}</h1>
          </div>

          {showEndPrompt && (
            <div className="mb-6 w-full max-w-md rounded-lg border border-white/15 bg-zinc-950/90 p-5 shadow-2xl backdrop-blur">
              <h2 className="text-xl font-semibold">Movie finished</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Want to post about {movie.title}? StreamSmart will connect the movie to your post.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => onPostAboutMovie(movie)}
                  className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 font-semibold transition hover:bg-red-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  Post about it
                </button>
                <button
                  onClick={() => setShowEndPrompt(false)}
                  className="rounded-md bg-zinc-800 px-4 py-2 font-semibold transition hover:bg-zinc-700"
                >
                  Maybe later
                </button>
              </div>
            </div>
          )}

          <div className="rounded-lg bg-black/55 p-4 backdrop-blur">
            <div className="relative mb-4 h-5">
              <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full bg-red-600 transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={(event) => seekMovie(Number(event.target.value))}
                className="absolute inset-0 h-5 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-5 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:mt-0.5 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
                aria-label="Seek movie progress"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsPlaying((current) => !current)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition hover:bg-zinc-200"
                aria-label={isPlaying ? 'Pause movie' : 'Play movie'}
              >
                {isPlaying ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}
              </button>
              <button
                onClick={restartMovie}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                aria-label="Restart movie"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <Volume2 className="h-5 w-5 text-zinc-300" />
              <div className="min-w-0 flex-1 text-sm text-zinc-300">
                <span>{Math.round(progress)}%</span>
                <span className="mx-2 text-zinc-600">/</span>
                <span>{isPlaying ? 'Playing' : progress >= 100 ? 'Complete' : 'Paused'}</span>
              </div>
              <button
                onClick={finishMovie}
                className="rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold transition hover:bg-zinc-700"
              >
                Finish demo
              </button>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 transition hover:bg-white/20"
                aria-label="Fullscreen"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
