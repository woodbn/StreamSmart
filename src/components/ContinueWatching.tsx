import { Play, Clock } from 'lucide-react';

const continueWatchingData = [
  {
    id: 1,
    title: 'Avengers',
    progress: 65,
    timeLeft: '42 min left',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop'
  },
  {
    id: 2,
    title: 'Stranger Things',
    progress: 23,
    timeLeft: 'S3 E4 • 38 min left',
    image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=225&fit=crop'
  },
  {
    id: 3,
    title: 'Whiplash',
    progress: 89,
    timeLeft: '8 min left',
    image: 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=400&h=225&fit=crop'
  }
];

interface ContinueWatchingProps {
  onWatchMovie: (movie: { title: string; image: string }) => void;
}

export function ContinueWatching({ onWatchMovie }: ContinueWatchingProps) {
  return (
    <div className="px-8 -mt-32 relative z-20 mb-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold">Continue Watching</h3>
        <span className="text-sm text-gray-400">AI curated for you</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {continueWatchingData.map((item) => (
          <div
            key={item.id}
            onClick={() => onWatchMovie(item)}
            className="relative group cursor-pointer overflow-hidden rounded-lg"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-40 object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <div
                className="h-full bg-red-600"
                style={{ width: `${item.progress}%` }}
              />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h4 className="font-semibold mb-1">{item.title}</h4>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Clock className="w-3 h-3" />
                <span>{item.timeLeft}</span>
              </div>
            </div>
            
            {/* Play button on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Play className="w-8 h-8" fill="white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
