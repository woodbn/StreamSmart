import { MovieRow } from './MovieRow';

const categories = [
  {
    title: 'Trending Now',
    movies: [
      { id: 1, title: 'Action Thriller', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop', rating: 8.5, mood: 'intense' },
      { id: 2, title: 'Sci-Fi Adventure', image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop', rating: 9.0, mood: 'thoughtful' },
      { id: 3, title: 'Mystery Drama', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop', rating: 8.7, mood: 'thoughtful' },
      { id: 4, title: 'Romance', image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&h=600&fit=crop', rating: 7.8, mood: 'romantic' },
      { id: 5, title: 'Comedy', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop', rating: 8.2, mood: 'happy' },
      { id: 6, title: 'Horror', image: 'https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=400&h=600&fit=crop', rating: 7.5, mood: 'intense' },
    ]
  },
  {
    title: 'Action & Adventure',
    movies: [
      { id: 7, title: 'Epic Quest', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop', rating: 8.9, mood: 'intense' },
      { id: 8, title: 'Space Warriors', image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400&h=600&fit=crop', rating: 8.4, mood: 'intense' },
      { id: 9, title: 'Urban Combat', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop', rating: 8.1, mood: 'intense' },
      { id: 10, title: 'Mountain Rescue', image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop', rating: 7.9, mood: 'intense' },
      { id: 11, title: 'Ocean Deep', image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop', rating: 8.3, mood: 'thoughtful' },
      { id: 12, title: 'Desert Storm', image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop', rating: 8.0, mood: 'intense' },
    ]
  },
  {
    title: 'Recommended for You',
    movies: [
      { id: 13, title: 'Family Time', image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=600&fit=crop', rating: 8.6, mood: 'happy' },
      { id: 14, title: 'Documentary', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop', rating: 9.1, mood: 'thoughtful' },
      { id: 15, title: 'Animated Fun', image: 'https://images.unsplash.com/photo-1571847140471-1d7766e825ea?w=400&h=600&fit=crop', rating: 8.8, mood: 'happy' },
      { id: 16, title: 'Thriller Night', image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop', rating: 8.5, mood: 'intense' },
      { id: 17, title: 'Love Stories', image: 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=400&h=600&fit=crop', rating: 7.7, mood: 'romantic' },
      { id: 18, title: 'Classic Cinema', image: 'https://images.unsplash.com/photo-1515634928627-2a4e0dae3ddf?w=400&h=600&fit=crop', rating: 9.3, mood: 'thoughtful' },
    ]
  }
];

interface MovieGridProps {
  filters: string[];
  onMovieSelect: (movieTitle?: string) => void;
  onWatchMovie: (movie: { title: string; image: string }) => void;
}

export function MovieGrid({ filters, onMovieSelect, onWatchMovie }: MovieGridProps) {
  const filteredCategories = categories.map(category => {
    if (filters.length === 0 || filters.includes('surprise')) {
      return category;
    }
    
    const filteredMovies = category.movies.filter(movie => 
      filters.some(filter => movie.mood === filter)
    );
    
    return {
      ...category,
      movies: filteredMovies
    };
  }).filter(category => category.movies.length > 0);

  return (
    <div className="px-8 relative z-20 space-y-12 pb-20">
      {filteredCategories.map((category) => (
        <MovieRow 
          key={category.title} 
          title={category.title} 
          movies={category.movies}
          onMovieSelect={onMovieSelect}
          onWatchMovie={onWatchMovie}
        />
      ))}
    </div>
  );
}
