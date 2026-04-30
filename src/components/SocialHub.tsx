/*
  SocialHub - High level overview

  - Purpose: a modal Social Hub that shows an activity feed, messages, and profile.
  - Data: starts with in-file mock data (`mockActivities`).
  - Interaction: local state (`activeTab`, `activities`) and handlers (`handleLike`, `handleFollow`).
  - Subcomponents: `ActivityCard` and `FriendCard` are defined inline below.
  - Presentation: uses Tailwind utility classes and `lucide-react` icons.
*/

import { useEffect, useState } from 'react';
import { X, Users, User, Heart, MessageCircle, Share2, TrendingUp, Award, Zap, Eye, UserPlus, ChevronDown, Send } from 'lucide-react';

interface SocialHubProps {
  isOpen: boolean;
  onClose: () => void;
  prefillMovie?: {
    title: string;
    image: string;
  } | null;
}

interface Activity {
  id: number;
  user: {
    name: string;
    avatar: string;
    isFollowing: boolean;
  };
  type: 'watched' | 'rated' | 'diary' | 'list' | 'achievement';
  movieTitle: string;
  movieImage: string;
  rating?: number;
  comment?: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}


/*
  Mock data

  - `mockActivities`: placeholder activity feed entries used to populate the Activity Feed tab.
  Replace with real API calls when integrating a backend.
*/

const mockActivities: Activity[] = [
  {
    id: 1,
    user: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      isFollowing: true
    },
    type: 'watched',
    movieTitle: "Avengers",
    movieImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
    rating: 5,
    comment: "Mind-blowing! The ending completely caught me off guard. Anyone else notice the quantum equation on the whiteboard in scene 3?",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    isLiked: false
  },
  {
    id: 2,
    user: {
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1776781205743-33b4c1106adc?q=80&w=1322&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      isFollowing: true
    },
    type: 'achievement',
    movieTitle: "Action Thriller Marathon",
    movieImage: "https://images.unsplash.com/photo-1574267432644-f610f5bb13d5?w=300&h=450&fit=crop",
    comment: "Unlocked 'Action Junkie' badge - Watched 50 action movies! 🏆",
    timestamp: "5 hours ago",
    likes: 42,
    comments: 12,
    isLiked: true
  },
  {
    id: 3,
    user: {
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      isFollowing: false
    },
    type: 'list',
    movieTitle: "Ultimate Sci-Fi Collection",
    movieImage: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop",
    comment: "Created a new list: 'Mind-Bending Sci-Fi' - 25 movies that will make you question reality",
    timestamp: "1 day ago",
    likes: 67,
    comments: 15,
    isLiked: false
  }
];

// Watch parties removed — not used anymore.

const mockFollowers: Activity['user'][] = [
  { name: 'Sarah Chen', avatar: mockActivities[0].user.avatar, isFollowing: true },
  { name: 'Mike Johnson', avatar: mockActivities[1].user.avatar, isFollowing: true },
  { name: 'Emma Wilson', avatar: mockActivities[2].user.avatar, isFollowing: false }
];

const mockFollowing: Activity['user'][] = [
  { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', isFollowing: true },
  { name: 'Jamie Lee', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', isFollowing: true }
];

const profileAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop";

/*
  SocialHub component (main)

  - Props: `isOpen` (visibility) and `onClose` (close callback).
  - Holds local UI state (active tab, activities) and the main handlers.
  - Renders header, tab bar, and tab-specific content (feed, messages, profile).
*/

export function SocialHub({ isOpen, onClose, prefillMovie }: SocialHubProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'messages' | 'profile'>('feed');
  const [activities, setActivities] = useState(mockActivities);
  const [newPostText, setNewPostText] = useState('');
  const [composerExpanded, setComposerExpanded] = useState(false);
  const [composerTitle, setComposerTitle] = useState('');
  const [composerMovie, setComposerMovie] = useState('');
  const [composerRating, setComposerRating] = useState<number | null>(null);
  const [showMoviePicker, setShowMoviePicker] = useState(false);
  const mockMovieOptions = [
    'Avengers',
    'Horror Night Marathon',
    'Ultimate Sci-Fi Collection'
  ];
  const achievements = activities.filter(a => a.type === 'achievement');
  const [commentsByActivity, setCommentsByActivity] = useState<Record<number, {user: string; text: string}[]>>(Object.fromEntries(mockActivities.map(a => [a.id, []])));
  const [followers, setFollowers] = useState<Activity['user'][]>(mockFollowers);
  const [following, setFollowing] = useState<Activity['user'][]>(mockFollowing);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [selectedDM, setSelectedDM] = useState<Activity['user'] | null>(null);
  const [messages, setMessages] = useState<Record<string, { from: string; text: string; unread?: boolean }[]>>({
    'Alex Rivera': [
      { from: 'Alex Rivera', text: 'Hey, what you think about Batman?', unread: true }
    ],
    'Jamie Lee': [
      { from: 'Jamie Lee', text: "What's up man", unread: true }
    ],
    'Sarah Chen': [
      { from: 'Sarah Chen', text: 'Loved your review — great catch on scene 3!', unread: false }
    ]
  });
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    if (!isOpen || !prefillMovie) return;

    setActiveTab('feed');
    setComposerExpanded(true);
    setComposerTitle(prefillMovie.title);
    setComposerMovie(prefillMovie.title);
    setNewPostText(`Just finished watching ${prefillMovie.title}. `);
  }, [isOpen, prefillMovie]);

  const getUnreadCount = (name: string) => (messages[name] || []).filter(m => m.unread).length;
  const contactsList = Array.from(new Map([...followers, ...following].map(u => [u.name, u])).values());
  contactsList.sort((a, b) => getUnreadCount(b.name) - getUnreadCount(a.name));

  const handleLike = (id: number) => {
    setActivities(activities.map(activity => 
      activity.id === id 
        ? { ...activity, isLiked: !activity.isLiked, likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1 }
        : activity
    ));
  };

  const setFollowForName = (name: string, isFollowing: boolean) => {
    // Update followers list flags
    setFollowers(prev => prev.map(u => u.name === name ? { ...u, isFollowing } : u));

    // Update following list: add when following, remove when unfollowing
    setFollowing(prev => {
      const exists = prev.find(u => u.name === name);
      if (isFollowing) {
        if (exists) return prev.map(u => u.name === name ? { ...u, isFollowing } : u);
        // try to find avatar from followers or activities
        const fromFollowers = followers.find(u => u.name === name);
        const fromActivityUser = activities.find(a => a.user.name === name)?.user;
        const avatar = fromFollowers?.avatar || fromActivityUser?.avatar || '';
        return [...prev, { name, avatar, isFollowing }];
      } else {
        return prev.filter(u => u.name !== name);
      }
    });

    // Update activities to reflect follow status
    setActivities(prev => prev.map(a => a.user.name === name ? { ...a, user: { ...a.user, isFollowing } } : a));
  };

  const handleFollow = (id: number) => {
    const target = activities.find(a => a.id === id);
    if (!target) return;
    const newVal = !target.user.isFollowing;
    setActivities(prev => prev.map(activity => activity.id === id ? { ...activity, user: { ...activity.user, isFollowing: newVal } } : activity));
    setFollowForName(target.user.name, newVal);
  };

  const handleFollowByName = (name: string) => {
    const cur = followers.find(u => u.name === name) || following.find(u => u.name === name);
    const newVal = !(cur?.isFollowing ?? false);
    setFollowForName(name, newVal);
  };

  const handleSubmitComment = (id: number, text: string) => {
    if (!text.trim()) return;
    const next = { ...(commentsByActivity || {}) } as Record<number, {user:string; text:string}[]>;
    next[id] = [...(next[id] || []), { user: 'You', text: text.trim() }];
    setCommentsByActivity(next);
    setActivities(activities.map(a => a.id === id ? { ...a, comments: a.comments + 1 } : a));
  };

  const sendMessage = (to: Activity['user']) => {
    if (!messageText.trim()) return;
    const key = to.name;
    const thread = messages[key] || [];
    const newMsg = { from: 'You', text: messageText.trim() };
    setMessages({ ...messages, [key]: [...thread, newMsg] });
    setMessageText('');
  };

  const createPost = () => {
    if (!newPostText.trim()) return;
    const p: Activity = {
      id: Date.now(),
      user: { name: 'You', avatar: profileAvatar, isFollowing: false },
      type: 'diary',
      movieTitle: composerMovie || composerTitle || 'Post',
      movieImage: prefillMovie?.title === composerMovie ? prefillMovie.image : composerMovie ? 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=300&h=450&fit=crop' : '',
      comment: newPostText.trim(),
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      isLiked: false
    };
    if (composerRating && composerRating > 0) {
      // @ts-ignore allow optional rating
      p.rating = composerRating;
    }
    setActivities([p, ...activities]);
    setNewPostText('');
    setComposerRating(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-800 to-red-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Social Hub</h2>
              <p className="text-sm text-white/80">Connect with friends and movie lovers</p>
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
                ? 'bg-zinc-800 text-white border-b-2 border-red-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Activity Feed
            </div>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'messages'
                ? 'bg-zinc-800 text-white border-b-2 border-red-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Messages
            </div>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'profile'
                ? 'bg-zinc-800 text-white border-b-2 border-red-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'feed' && (
            <div className="p-6 space-y-6">

              {/* Compact composer: expands when user clicks Start Post */}
              <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
                {!composerExpanded ? (
                  <div className="flex items-center gap-3">
                    <img src={profileAvatar} alt="you" className="w-10 h-10 rounded-full object-cover" />
                    <input
                      onFocus={() => setComposerExpanded(true)}
                      placeholder="What's on your mind?"
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 text-sm outline-none"
                    />
                    <button onClick={() => setComposerExpanded(true)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full">Start Post</button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-3">
                      <input value={composerTitle} onChange={e => setComposerTitle(e.target.value)} placeholder="Title (optional)" className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm mb-2 outline-none" />
                      <div className="flex gap-2 items-center mb-2">
                        <input value={composerMovie} onChange={e => setComposerMovie(e.target.value)} placeholder="Connect a movie (optional)" className="flex-1 bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm outline-none" />
                        <button onClick={() => setShowMoviePicker(true)} className="text-sm text-gray-400">Browse</button>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-sm text-gray-300">Rating:</div>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(n => (
                            <button key={n} onClick={() => setComposerRating(n)} className={`p-1 ${composerRating && composerRating >= n ? 'text-red-500' : 'text-gray-500'}`}>
                              <Heart className="w-4 h-4" />
                            </button>
                          ))}
                          <button onClick={() => setComposerRating(null)} className="text-xs text-gray-400 ml-2">Clear</button>
                        </div>
                      </div>

                      <textarea
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); createPost(); } }}
                        placeholder="Write your post..."
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-3 text-sm resize-none h-28 mb-3 outline-none"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setComposerExpanded(false); setNewPostText(''); setComposerTitle(''); setComposerMovie(''); }} className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded-lg">Cancel</button>
                        <button onClick={() => { createPost(); setComposerExpanded(false); setComposerTitle(''); setComposerMovie(''); }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Post</button>
                      </div>
                    </div>
                  </div>
                )}

                {showMoviePicker && (
                  <div className="mt-2 bg-zinc-900 border border-zinc-700 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Select a movie</div>
                      <button onClick={() => setShowMoviePicker(false)} className="text-sm text-gray-400">Close</button>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {mockMovieOptions.map(m => (
                        <button key={m} onClick={() => { setComposerMovie(m); setShowMoviePicker(false); }} className="text-left p-2 rounded hover:bg-zinc-800">{m}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Feed */}
              {activities.map(activity => (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity} 
                  onLike={handleLike}
                  onFollow={handleFollow}
                  comments={commentsByActivity[activity.id] || []}
                  onSubmitComment={handleSubmitComment}
                />
              ))}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-6 space-y-6">
              <div className="bg-zinc-800 rounded-lg p-6 flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
                  alt="Your avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold mb-1">Your Name</h3>
                  <p className="text-gray-300">Short bio or status goes here. Customize in the profile tab.</p>
                  <div className="mt-4 flex items-center gap-3">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-semibold">Edit Profile</button>
                    <button className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg transition">Settings</button>
                  </div>
                      <div className="mt-4 flex items-center gap-4">
                        <button onClick={() => setShowFollowers(!showFollowers)} className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 px-3 py-2 rounded-lg">
                          <div>
                            <div className="text-lg font-bold">{followers.length}</div>
                            <div className="text-xs text-gray-400">Followers</div>
                          </div>
                          <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFollowers ? 'rotate-180' : ''}`} />
                        </button>
                        <button onClick={() => setShowFollowing(!showFollowing)} className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 px-3 py-2 rounded-lg">
                          <div>
                            <div className="text-lg font-bold">{following.length}</div>
                            <div className="text-xs text-gray-400">Following</div>
                          </div>
                          <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFollowing ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                </div>
              </div>

                  {showFollowers && (
                    <div className="mt-4 bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                      <h4 className="font-bold mb-3">Followers</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {followers.map((u) => (
                          <FriendCard key={u.name} user={u} onFollow={() => handleFollowByName(u.name)} />
                        ))}
                      </div>
                    </div>
                  )}

                  {showFollowing && (
                    <div className="mt-4 bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                      <h4 className="font-bold mb-3">Following</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {following.map((u) => (
                          <FriendCard key={u.name} user={u} onFollow={() => handleFollowByName(u.name)} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                  <h4 className="font-bold mb-2">Recent Activity</h4>
                  <div className="space-y-3">
                    {activities.slice(0, 3).map(a => (
                      <ActivityCard key={a.id} activity={a} onLike={handleLike} onFollow={handleFollow} comments={commentsByActivity[a.id] || []} onSubmitComment={handleSubmitComment} />
                    ))}
                    <button onClick={() => setShowAchievements(!showAchievements)} className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 px-3 py-2 rounded-lg">
                      <div>
                        <div className="text-lg font-bold">{achievements.length}</div>
                        <div className="text-xs text-gray-400">Achievements</div>
                      </div>
                      <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showAchievements ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {showAchievements && (
                <div className="mt-4 bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                  <h4 className="font-bold mb-3">Achievements</h4>
                  <div className="space-y-3">
                    {achievements.map(a => (
                      <ActivityCard key={a.id} activity={a} onLike={handleLike} onFollow={handleFollow} comments={commentsByActivity[a.id] || []} onSubmitComment={handleSubmitComment} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Contacts list */}
                <div className="md:col-span-1 bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold">Messages</h3>
                  </div>
                  <div className="space-y-2 overflow-y-auto max-h-[60vh]">
                    {contactsList.map((u) => (
                      <div key={u.name} onClick={() => { setSelectedDM(u); setMessages(prev => ({ ...prev, [u.name]: (prev[u.name] || []).map(m => ({ ...m, unread: false })) })); }} className={`flex items-center gap-3 p-2 rounded-md hover:bg-zinc-700 cursor-pointer ${selectedDM?.name === u.name ? 'bg-zinc-700' : ''}`}>
                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-xs text-gray-400">{u.isFollowing ? 'Following' : 'Not following'}</div>
                        </div>
                        {getUnreadCount(u.name) > 0 && (
                          <div className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{getUnreadCount(u.name)}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message pane */}
                <div className="md:col-span-2 bg-zinc-800 rounded-lg p-4 border border-zinc-700 flex flex-col">
                  {selectedDM ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <img src={selectedDM.avatar} alt={selectedDM.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <div className="font-bold">{selectedDM.name}</div>
                          <div className="text-xs text-gray-400">Direct Message</div>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                        {(messages[selectedDM.name] || []).map((m, i) => (
                          <div key={i} className={`p-3 rounded-md ${m.from === 'You' ? 'bg-red-700 text-white self-end' : 'bg-zinc-700 text-gray-200'}`}>
                            <div className="text-sm">{m.text}</div>
                            <div className="text-xs text-gray-400 mt-1">{m.from}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (selectedDM) sendMessage(selectedDM); } }}
                          placeholder={`Message ${selectedDM.name}`}
                          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none"
                        />
                        <button onClick={() => sendMessage(selectedDM)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">Select a contact to start messaging</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/*
  ActivityCard

  - Presentation for a single activity item in the feed.
  - Shows user header, media, rating/comment, and action buttons (like, comment, share).
  - Calls `onLike` and `onFollow` passed from the parent to update state.
*/

function ActivityCard({ activity, onLike, onFollow, comments, onSubmitComment }: { activity: Activity; onLike: (id: number) => void; onFollow: (id: number) => void; comments?: {user:string; text:string}[]; onSubmitComment?: (id:number, text:string) => void }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const submit = () => {
    if (!onSubmitComment) return;
    onSubmitComment(activity.id, commentText);
    setCommentText('');
    setShowComments(true);
  };

  return (
    <div className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
      <div className="p-5">
        {/* User Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={activity.user.avatar}
              alt={activity.user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{activity.user.name}</span>
                {activity.type === 'achievement' && (
                  <Award className="w-4 h-4 text-yellow-500" />
                )}
              </div>
              <div className="text-sm text-gray-400">{activity.timestamp}</div>
            </div>
          </div>
          {activity.user.name !== 'You' && !activity.user.isFollowing && (
            <button 
              onClick={() => onFollow(activity.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition text-sm"
            >
              Follow
            </button>
          )}
        </div>

        {/* Content */}
          <div className="flex gap-4">
          {activity.movieImage ? (
            <img
              src={activity.movieImage}
              alt={activity.movieTitle}
              className="w-24 h-36 object-cover rounded flex-shrink-0"
            />
          ) : null}
          <div className="flex-1">
            <h4 className="font-bold mb-2">{activity.movieTitle}</h4>
            {activity.rating && (
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Heart
                    key={star}
                    className={`w-4 h-4 ${
                      star <= activity.rating!
                        ? 'text-red-500 fill-red-500'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
            )}
            {activity.comment && (
              <p className="text-gray-300 text-sm">{activity.comment}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 pt-4 mt-4 border-t border-zinc-700">
          <button
            onClick={() => onLike(activity.id)}
            className={`flex items-center gap-2 transition ${
              activity.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={activity.isLiked ? 'fill-red-500' : ''} />
            <span className="text-sm font-semibold">{activity.likes}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">{activity.comments}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition ml-auto">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-semibold">Share</span>
          </button>
        </div>
        {showComments && (
          <div className="mt-4 border-t border-zinc-700 pt-4">
            <div className="space-y-3 mb-3">
              {(comments || []).map((c, i) => (
                <div key={i} className="text-sm bg-zinc-900 p-2 rounded">
                  <div className="font-semibold text-xs text-gray-300">{c.user}</div>
                  <div className="text-gray-200">{c.text}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
                placeholder="Write a comment..."
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none"
              />
              <button onClick={submit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Comment</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/*
  FriendCard

  - Simple friend list item used by the Friends tab.
  - Displays avatar, name and follow/following button which calls `onFollow`.
*/

function FriendCard({ user, onFollow }: { user: Activity['user']; onFollow: () => void }) {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-zinc-600 transition">
      <div className="flex items-center gap-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="font-semibold">{user.name}</div>
          <div className="text-sm text-gray-400">Watched 47 movies this month</div>
        </div>
        <button
          onClick={onFollow}
          className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${
            user.isFollowing
              ? 'bg-zinc-700 hover:bg-zinc-600 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {user.isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
}
