/*
  SocialHub - High level overview

  - Purpose: a modal Social Hub that shows an activity feed, watch parties, and friends.
  - Data: starts with in-file mock data (`mockActivities`, `mockWatchParties`).
  - Interaction: local state (`activeTab`, `activities`) and handlers (`handleLike`, `handleFollow`).
  - Subcomponents: `ActivityCard`, `WatchPartyCard`, `FriendCard` are defined inline below.
  - Presentation: uses Tailwind utility classes and `lucide-react` icons.
*/

import { useState } from 'react';
import { X, Users, Heart, MessageCircle, Share2, Play, Clock, TrendingUp, Award, Zap, Eye, UserPlus, Settings, ChevronDown, Send } from 'lucide-react';

interface SocialHubProps {
  isOpen: boolean;
  onClose: () => void;
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

interface WatchParty {
  id: number;
  host: string;
  hostAvatar: string;
  movieTitle: string;
  movieImage: string;
  startTime: string;
  participants: number;
  maxParticipants: number;
  isLive: boolean;
}

/*
  Mock data

  - `mockActivities`: placeholder activity feed entries used to populate the Activity Feed tab.
  - `mockWatchParties`: placeholder watch party entries used by the Watch Parties tab.
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
    movieTitle: "The Quantum Heist",
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
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
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

const mockWatchParties: WatchParty[] = [
  {
    id: 1,
    host: "Alex Rivera",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    movieTitle: "The Quantum Heist",
    movieImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
    startTime: "Starting in 15 min",
    participants: 8,
    maxParticipants: 10,
    isLive: false
  },
  {
    id: 2,
    host: "Jamie Lee",
    hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    movieTitle: "Horror Night Marathon",
    movieImage: "https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=300&h=450&fit=crop",
    startTime: "Live Now",
    participants: 15,
    maxParticipants: 20,
    isLive: true
  }
];

const mockFollowers: Activity['user'][] = [
  { name: 'Sarah Chen', avatar: mockActivities[0].user.avatar, isFollowing: true },
  { name: 'Mike Johnson', avatar: mockActivities[1].user.avatar, isFollowing: true },
  { name: 'Emma Wilson', avatar: mockActivities[2].user.avatar, isFollowing: false }
];

const mockFollowing: Activity['user'][] = [
  { name: 'Alex Rivera', avatar: mockWatchParties[0].hostAvatar, isFollowing: true },
  { name: 'Jamie Lee', avatar: mockWatchParties[1].hostAvatar, isFollowing: true }
];

/*
  SocialHub component (main)

  - Props: `isOpen` (visibility) and `onClose` (close callback).
  - Holds local UI state (active tab, activities) and the main handlers.
  - Renders header, tab bar, and tab-specific content (feed, parties, friends).
*/

export function SocialHub({ isOpen, onClose }: SocialHubProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'profile' | 'friends'>('feed');
  const [activities, setActivities] = useState(mockActivities);
  const [commentsByActivity, setCommentsByActivity] = useState<Record<number, {user: string; text: string}[]>>(Object.fromEntries(mockActivities.map(a => [a.id, []])));
  const [followers] = useState<Activity['user'][]>(mockFollowers);
  const [following] = useState<Activity['user'][]>(mockFollowing);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [selectedDM, setSelectedDM] = useState<Activity['user'] | null>(null);
  const [messages, setMessages] = useState<Record<string, { from: string; text: string }[]>>({});
  const [messageText, setMessageText] = useState('');

  const handleLike = (id: number) => {
    setActivities(activities.map(activity => 
      activity.id === id 
        ? { ...activity, isLiked: !activity.isLiked, likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1 }
        : activity
    ));
  };

  const handleFollow = (id: number) => {
    setActivities(activities.map(activity => 
      activity.id === id 
        ? { ...activity, user: { ...activity.user, isFollowing: !activity.user.isFollowing } }
        : activity
    ));
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
                ? 'bg-zinc-800 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Activity Feed
            </div>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'profile'
                ? 'bg-zinc-800 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Settings className="w-5 h-5" />
              Profile
            </div>
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'friends'
                ? 'bg-zinc-800 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Friends
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'feed' && (
            <div className="p-6 space-y-6">
              {/* Quick Stats Bar */}
              <div className="grid grid-cols-3 gap-4 bg-zinc-800/50 rounded-lg p-4">
                <div className="text-center">
                  <Eye className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                  <div className="text-2xl font-bold">127</div>
                  <div className="text-xs text-gray-400">Friends Active</div>
                </div>
                <div className="text-center">
                  <Zap className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
                  <div className="text-2xl font-bold">45</div>
                  <div className="text-xs text-gray-400">New Activities</div>
                </div>
                <div className="text-center">
                  <Award className="w-6 h-6 mx-auto mb-1 text-purple-500" />
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs text-gray-400">Achievements</div>
                </div>
                
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
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-semibold">Edit Profile</button>
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
                          <FriendCard key={u.name} user={u} onFollow={() => {}} />
                        ))}
                      </div>
                    </div>
                  )}

                  {showFollowing && (
                    <div className="mt-4 bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                      <h4 className="font-bold mb-3">Following</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {following.map((u) => (
                          <FriendCard key={u.name} user={u} onFollow={() => {}} />
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Contacts list */}
                <div className="md:col-span-1 bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold">Messages</h3>
                    <button className="text-sm text-gray-400">New</button>
                  </div>
                  <div className="space-y-2 overflow-y-auto max-h-[60vh]">
                    {Array.from(new Map([...followers, ...following].map(u => [u.name, u])).values()).map((u) => (
                      <div key={u.name} onClick={() => setSelectedDM(u)} className={`flex items-center gap-3 p-2 rounded-md hover:bg-zinc-700 cursor-pointer ${selectedDM?.name === u.name ? 'bg-zinc-700' : ''}`}>
                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-xs text-gray-400">{u.isFollowing ? 'Following' : 'Not following'}</div>
                        </div>
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
                          <div key={i} className={`p-3 rounded-md ${m.from === 'You' ? 'bg-blue-600 text-white self-end' : 'bg-zinc-700 text-gray-200'}`}>
                            <div className="text-sm">{m.text}</div>
                            <div className="text-xs text-gray-400 mt-1">{m.from}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <input value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder={`Message ${selectedDM.name}`} className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none" />
                        <button onClick={() => sendMessage(selectedDM)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
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
          {!activity.user.isFollowing && (
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
          <img
            src={activity.movieImage}
            alt={activity.movieTitle}
            className="w-24 h-36 object-cover rounded flex-shrink-0"
          />
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
              <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none" />
              <button onClick={submit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Comment</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/*
  WatchPartyCard

  - Presentation for a single watch party.
  - Shows poster, host info, start time, participants and a Join/Reserve button.
  - UI-only in this file; hook into backend to enable live/join functionality.
*/

function WatchPartyCard({ party }: { party: WatchParty }) {
  return (
    <div className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 hover:border-blue-600 transition">
      <div className="relative">
        <img
          src={party.movieImage}
          alt={party.movieTitle}
          className="w-full h-40 object-cover"
        />
        {party.isLive && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            LIVE
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-bold mb-2">{party.movieTitle}</h4>
        <div className="flex items-center gap-2 mb-3">
          <img
            src={party.hostAvatar}
            alt={party.host}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-400">Hosted by {party.host}</span>
        </div>
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            {party.startTime}
          </div>
          <div className="text-gray-400">
            {party.participants}/{party.maxParticipants} joined
          </div>
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-semibold">
          {party.isLive ? 'Join Now' : 'Reserve Spot'}
        </button>
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
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {user.isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
}
