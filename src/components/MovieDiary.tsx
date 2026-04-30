import { useState } from 'react';
import { X, BookOpen, Lock, Users, Calendar, Heart, Sparkles, ThumbsUp, MessageCircle, Share2, Plus, Film } from 'lucide-react';

interface DiaryEntry {
  id: number;
  userName: string;
  userAvatar: string;
  movieTitle: string;
  movieImage: string;
  dateWatched: string;
  rating: number;
  mood: string;
  thoughts: string;
  isPrivate: boolean;
  likes: number;
  comments: number;
  aiInsight?: string;
}

interface MovieDiaryProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockEntries: DiaryEntry[] = [
  {
    id: 1,
    userName: "You",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    movieTitle: "Avengers",
    movieImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
    dateWatched: "Today",
    rating: 5,
    mood: "Mind-blown 🤯",
    thoughts: "Just finished watching this masterpiece! The plot twists kept me on the edge of my seat. The scene where they reveal the quantum paradox was absolutely brilliant. Nolan has outdone himself again!",
    isPrivate: false,
    likes: 24,
    comments: 5,
    aiInsight: "Your viewing pattern shows you enjoy complex sci-fi narratives. You might also like 'Primer' and 'Predestination'."
  },
  {
    id: 2,
    userName: "Sarah_MovieLover",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    movieTitle: "Whiplash",
    movieImage: "https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=300&h=450&fit=crop",
    dateWatched: "Yesterday",
    rating: 4,
    mood: "Warm & Fuzzy 💕",
    thoughts: "Perfect cozy evening movie! The cinematography of Paris was stunning. Made me want to book a trip immediately. The ending was predictable but still made me tear up.",
    isPrivate: false,
    likes: 18,
    comments: 3
  },
  {
    id: 3,
    userName: "Mike_CinemaFan",
    userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
    movieTitle: "Urban Combat",
    movieImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
    dateWatched: "2 days ago",
    rating: 5,
    mood: "Pumped! 💪",
    thoughts: "The action sequences were insane! Watched with the boys on movie night and we couldn't stop talking about the rooftop chase scene. Definitely watching this again.",
    isPrivate: false,
    likes: 42,
    comments: 12
  }
];

const moodOptions = [
  { emoji: "🤯", label: "Mind-blown" },
  { emoji: "😂", label: "Hilarious" },
  { emoji: "😢", label: "Emotional" },
  { emoji: "😱", label: "Thrilled" },
  { emoji: "💕", label: "Warm & Fuzzy" },
  { emoji: "💪", label: "Pumped" },
  { emoji: "🤔", label: "Thoughtful" },
  { emoji: "😴", label: "Sleepy" }
];

export function MovieDiary({ isOpen, onClose }: MovieDiaryProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'my-diary'>('feed');
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    movieTitle: '',
    dateWatched: new Date().toISOString().split('T')[0],
    rating: 0,
    mood: '',
    thoughts: '',
    isPrivate: false
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmitEntry = () => {
    if (!newEntry.movieTitle || !newEntry.thoughts || newEntry.rating === 0) {
      alert('Please fill in all required fields');
      return;
    }
    
    alert(`Diary entry saved!\n\nMovie: ${newEntry.movieTitle}\nRating: ${newEntry.rating} stars\nPrivacy: ${newEntry.isPrivate ? 'Private' : 'Shared with friends'}`);
    
    setShowNewEntry(false);
    setNewEntry({
      movieTitle: '',
      dateWatched: new Date().toISOString().split('T')[0],
      rating: 0,
      mood: '',
      thoughts: '',
      isPrivate: false
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Movie Diary</h2>
              <p className="text-sm text-white/80">Share your movie journey with friends</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-900">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'feed'
                ? 'bg-zinc-800 text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Friends' Diaries
            </div>
          </button>
          <button
            onClick={() => setActiveTab('my-diary')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'my-diary'
                ? 'bg-zinc-800 text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" />
              My Diary
            </div>
          </button>
        </div>

        {/* New Entry Button */}
        {activeTab === 'my-diary' && !showNewEntry && (
          <div className="p-4 bg-zinc-800/50 border-b border-zinc-800">
            <button
              onClick={() => setShowNewEntry(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-4 rounded-lg transition font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Diary Entry
            </button>
          </div>
        )}

        {/* New Entry Form */}
        {showNewEntry && (
          <div className="p-6 bg-zinc-800/50 border-b border-zinc-800">
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Create New Entry</h3>
                <button
                  onClick={() => setShowNewEntry(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Movie Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Movie Title *</label>
                  <div className="relative">
                    <Film className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={newEntry.movieTitle}
                      onChange={(e) => setNewEntry({...newEntry, movieTitle: e.target.value})}
                      placeholder="Search or type movie name..."
                      className="w-full bg-zinc-800 text-white rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                {/* Date Watched */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Date Watched</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={newEntry.dateWatched}
                      onChange={(e) => setNewEntry({...newEntry, dateWatched: e.target.value})}
                      className="w-full bg-zinc-800 text-white rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Your Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setNewEntry({...newEntry, rating: star})}
                    >
                      <Heart
                        className={`w-8 h-8 transition cursor-pointer ${
                          star <= (hoveredRating || newEntry.rating)
                            ? 'text-red-500 fill-red-500'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                  {newEntry.rating > 0 && (
                    <span className="ml-2 text-gray-400 self-center">{newEntry.rating} hearts</span>
                  )}
                </div>
              </div>

              {/* Mood */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">How did it make you feel?</label>
                <div className="flex flex-wrap gap-2">
                  {moodOptions.map(mood => (
                    <button
                      key={mood.label}
                      onClick={() => setNewEntry({...newEntry, mood: `${mood.label} ${mood.emoji}`})}
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        newEntry.mood === `${mood.label} ${mood.emoji}`
                          ? 'bg-purple-600 text-white'
                          : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                      }`}
                    >
                      {mood.emoji} {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thoughts */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Your Thoughts *</label>
                <textarea
                  value={newEntry.thoughts}
                  onChange={(e) => setNewEntry({...newEntry, thoughts: e.target.value})}
                  placeholder="What did you think about this movie? Any memorable moments, favorite scenes, or feelings you want to remember?"
                  className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 min-h-[120px]"
                />
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>AI will provide personalized insights based on your entry</span>
                </div>
              </div>

              {/* Privacy Toggle */}
              <div className="mb-4 flex items-center justify-between bg-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  {newEntry.isPrivate ? (
                    <Lock className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Users className="w-5 h-5 text-green-500" />
                  )}
                  <div>
                    <div className="font-semibold">
                      {newEntry.isPrivate ? 'Private Entry' : 'Share with Friends'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {newEntry.isPrivate 
                        ? 'Only you can see this entry' 
                        : 'Your friends can see and interact with this entry'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setNewEntry({...newEntry, isPrivate: !newEntry.isPrivate})}
                  className={`relative w-14 h-7 rounded-full transition ${
                    newEntry.isPrivate ? 'bg-zinc-700' : 'bg-green-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      newEntry.isPrivate ? 'left-1' : 'left-8'
                    }`}
                  />
                </button>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitEntry}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition font-semibold"
              >
                Save Diary Entry
              </button>
            </div>
          </div>
        )}

        {/* Entries Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {mockEntries
            .filter(entry => activeTab === 'feed' || entry.userName === 'You')
            .map(entry => (
              <DiaryEntryCard key={entry.id} entry={entry} />
            ))}
        </div>
      </div>
    </div>
  );
}

function DiaryEntryCard({ entry }: { entry: DiaryEntry }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 hover:border-zinc-600 transition">
      <div className="p-5">
        {/* User Header */}
        <div className="flex items-start gap-4 mb-4">
          <img
            src={entry.userAvatar}
            alt={entry.userName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{entry.userName}</span>
              {entry.isPrivate && (
                <Lock className="w-4 h-4 text-yellow-500" />
              )}
              <span className="text-gray-400 text-sm">• {entry.dateWatched}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Watched this movie</span>
            </div>
          </div>
        </div>

        {/* Movie Info */}
        <div className="flex gap-4 mb-4">
          <img
            src={entry.movieImage}
            alt={entry.movieTitle}
            className="w-24 h-36 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{entry.movieTitle}</h3>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(heart => (
                <Heart
                  key={heart}
                  className={`w-5 h-5 ${
                    heart <= entry.rating
                      ? 'text-red-500 fill-red-500'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            {entry.mood && (
              <div className="inline-block bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                {entry.mood}
              </div>
            )}
          </div>
        </div>

        {/* Thoughts */}
        <p className="text-gray-300 leading-relaxed mb-4">{entry.thoughts}</p>

        {/* AI Insight */}
        {entry.aiInsight && (
          <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-700/50 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-purple-300 mb-1">AI Insight</div>
                <p className="text-sm text-gray-300">{entry.aiInsight}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 pt-4 border-t border-zinc-700">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-2 transition ${
              liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
            <span className="text-sm font-semibold">
              {entry.likes + (liked ? 1 : 0)}
            </span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">{entry.comments}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition ml-auto">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-semibold">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
