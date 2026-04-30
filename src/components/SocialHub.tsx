// SocialHub is the main area for the social features
// It has three tabs( activity feed, messages, and profile)

import { useEffect, useState } from 'react';
import { X, Users, User, Heart, MessageCircle, Share2, TrendingUp, Award, ChevronDown, Send } from 'lucide-react';

// Props for SocialHub component
interface SocialHubProps {
  isOpen: boolean; 
  onClose: () => void; // function to close social hub
  prefillMovie?: {
    title: string;
    image: string;
  } | null; // optional movie info to prefill a post when coming from watch page
}

// Represents a single activity/post in the social feed
interface Activity {
  id: number; // id for the post
  user: {
    name: string; // username of poset
    avatar: string; // profile picture as a URL
    isFollowing: boolean; // if current user follows them
  };
  type: 'watched'|'rated'|'post' |'list' |'achievement'; 
  movieTitle?: string; // optional
  movieImage: string; 
  rating?: number; // optional out of 5
  comment?: string; // optional
  timestamp: string; // when it hapened 
  likes: number; // # of likes
  comments: number; // # of comments
  isLiked: boolean; // if current user liked it
}

// Mock Data for the activity feed
const mockActivities: Activity[] = [
  {
    id: 1,
    user:{
      name: "Sarah James",
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
    user:{
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

// Example people for the profile and messages views.
const mockFollowers: Activity['user'][] = [
  {name: 'Sarah James', avatar: mockActivities[0].user.avatar, isFollowing: true},
  {name: 'Mike Johnson', avatar: mockActivities[1].user.avatar, isFollowing: true},
  {name: 'Emma Wilson', avatar: mockActivities[2].user.avatar, isFollowing: false}
];

const mockFollowing: Activity['user'][] = [
  {name: 'Alex Williams', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', isFollowing: true},
  {name: 'Jack Lee', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', isFollowing: true}
];

const profileAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop";

// Small set of profile achievements for the profile dropdown.
const profileAchievements = [
  {id: 'act_1', title: 'First Post', description: 'Create your first activity post', achieved: true, progress: 1}, 
  {id: 'act_2', title: 'Social Starter', description: 'Follow 5 people', achieved: false, progress: 0.4}, 
  {id: 'act_3', title: 'Marathon Viewer', description: 'Watch 10 movies', achieved: false, progress: 0.7}, 
  {id: 'act_4', title: 'Critic', description: 'Write 5 reviews', achieved: true, progress: 1}, 
  {id: 'act_5', title: 'Collector', description: 'Create 3 lists', achieved: false, progress: 0.2}, 
];

// Main SocialHub component
export function SocialHub({ isOpen, onClose, prefillMovie }: SocialHubProps) {
  
  const [activeTab, setActiveTab] = useState<'feed' | 'messages'| 'profile'>('feed'); // Tracks which tab is open
  const [activities, setActivities] = useState(mockActivities); // Activity feed state, new posts added here


  // post composer fields here
  const [newPostText, setNewPostText] = useState('');
  const [composerExpanded, setComposerExpanded] = useState(false);
  const [composerTitle, setComposerTitle] = useState('');  
  const [composerMovie, setComposerMovie] = useState(''); 
  const [composerRating, setComposerRating] = useState<number| null>(null);
  const [showMoviePicker, setShowMoviePicker] = useState(false);

  // simple mock movie choices for the movie connector in the post composer
  const mockMovieOptions = [
    'Avengers',
    'Inception',
    'Forest Gump'
  ];
  const [commentsByActivity, setCommentsByActivity] = useState<Record<number, {user: string; text: string}[]>>(Object.fromEntries(mockActivities.map(a => [a.id, []])));
  const [followers, setFollowers] = useState<Activity['user'][]>(mockFollowers);
  const [following, setFollowing] = useState<Activity['user'][]>(mockFollowing);
  // Only one profile dropdown should be open at a time
  const [activeProfileSection, setActiveProfileSection] = useState<'followers'| 'following' | 'achievements'| null>(null);

  // Direct message state(which dm thread is open, messages in each of the threads)
  const [selectedDM, setSelectedDM] = useState<Activity['user'] | null>(null);  
  const [messages, setMessages] = useState<Record<string, { from: string; text: string; unread?: boolean }[]>>({
    'Alex Williams': [{ from: 'Alex Williams', text: 'Hey, what you think about Batman?', unread: true }],
    'Jack Lee': [{ from: 'Jack Lee', text: "What's up man", unread: true }],
    'Sarah James': [{ from: 'Sarah James', text: 'Loved your review, great catch on scene 3!', unread: false }]
  });
  const [messageText, setMessageText] = useState('');
  const [postConfirmation, setPostConfirmation] = useState('');

  // init booleans to track which profile dropdown is open
  const showFollowers = activeProfileSection === 'followers';
  const showFollowing = activeProfileSection === 'following';
  const showAchievements = activeProfileSection === 'achievements';

  // When coming from watch page, open the post button on the feed and prefill the post with the movie
  useEffect(() => {
    if (!isOpen || !prefillMovie) return;

    setActiveTab('feed');
    setComposerExpanded(true);
    setComposerTitle(prefillMovie.title);
    setComposerMovie(prefillMovie.title);
    setNewPostText(`Just finished watching ${prefillMovie.title}. `);
  }, [isOpen, prefillMovie]);

  // Hide the "post published" message after a few secs 
  useEffect(() => {
    if (!postConfirmation) return;

    const timer = window.setTimeout(() => setPostConfirmation(''), 3000);
    return () => window.clearTimeout(timer);
  }, [postConfirmation]);

  // Message list helpers
  const getUnreadCount = (name: string) => (messages[name]|| []).filter(m => m.unread).length;
  // Combine followers and following lists to show all contacts in the messages tab
  const contactsList = Array.from(new Map([...following, ...followers].map(u => [u.name, u])).values());
  // recent activity on prfile should only show the current user's posts
  const userActivities = activities.filter((activity) => activity.user.name === 'You');


  // like or unlike a post 
  const handleLike = (id: number)=>{
    setActivities(activities.map(activity => 
      activity.id === id 
        ? { ...activity, isLiked: !activity.isLiked, likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1 }
        : activity
    ));
  };

  // Shared helper for following or unfollowing
  const setFollowForName = (name: string, isFollowing: boolean)=>{
    // Update followers list flags
    setFollowers(prev => prev.map(u => u.name === name ? {...u, isFollowing} : u));

    // Update the following list
    setFollowing(prev => {
      const exists = prev.find(u => u.name === name);
      if (isFollowing) {
        if (exists) return prev.map(u => u.name === name ? { ...u, isFollowing } : u);
        // If user not already in following, find their avatar to add them to thefollowing list
        const fromFollowers = followers.find(u => u.name === name);
        const fromActivityUser = activities.find(a => a.user.name === name)?.user;
        const avatar = fromFollowers?.avatar || fromActivityUser?.avatar || '';
        return [...prev, { name, avatar, isFollowing }]; 
      } else {   
        return prev.filter(u => u.name !== name);
      }
    });

    // Update activities to reflect updated following status
    setActivities(prev => prev.map(a => a.user.name === name ? { ...a, user: { ...a.user, isFollowing } } : a));
  };

  // Used by the follow button on the feed
  const handleFollow = (id: number) => {
    const target = activities.find(a => a.id === id);  
    if (!target) return;
    const newVal = !target.user.isFollowing; 
    setActivities(prev => prev.map(activity => activity.id === id ? { ...activity, user: { ...activity.user, isFollowing: newVal } } : activity));
    setFollowForName(target.user.name, newVal);
  };

  // Used by the profile follower/following dropdown menus
  const handleFollowByName = (name: string) => {
    const cur = followers.find(u => u.name === name) || following.find(u => u.name === name);
    const newVal = !(cur?.isFollowing ?? false);
    setFollowForName(name, newVal);
  };

  // Adds a comment to a given post in the feed
  const handleSubmitComment = (id: number, text: string) => {
    if (!text.trim()) return;  
    const next = {...(commentsByActivity || {})} as Record<number, {user:string; text:string}[]>;
    next[id] = [...(next[id] || []), { user: 'You', text: text.trim() }];
    setCommentsByActivity(next); 
    setActivities(activities.map(a => a.id === id ? { ...a, comments: a.comments + 1 } : a));
  };

  // Sends a simple local direct message  
  const sendMessage = (to: Activity['user'])=>{
    if (!messageText.trim()) return;
    const key = to.name;
    const thread = messages[key] || [];  
    const newMsg = { from: 'You', text: messageText.trim() };

    // This is all local state for the demo; a backend would save the thread
    setMessages({ ...messages, [key]: [...thread, newMsg] });
    setMessageText('');
  };

  // Creates a new post from the message composer, returns true or false we can tell if it should to close the composer
  const createPost = ()=>{
    if (!newPostText.trim()) return false;
    const p: Activity = { 
      id: Date.now(),
      user: { name: 'You', avatar: profileAvatar, isFollowing: false },   
      type: 'post',

      // Title and movie connection are optional, if both are blank, the post just shows the post body
      movieTitle: composerMovie||composerTitle,

      // If this post came from the watch page, use that movie's image. Else, use a default movie image when a movie is manually connected.
      movieImage: prefillMovie?.title === composerMovie ? prefillMovie.image : composerMovie ? 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=300&h=450&fit=crop' : '',
      comment: newPostText.trim(),
      timestamp:'Just now',  
      likes: 0,
      comments: 0, 
      isLiked: false
    };
    if (composerRating &&composerRating >0) {
      p.rating = composerRating;  
    }
    setActivities([p, ...activities]);
    setNewPostText('');
    setComposerRating(null);
    setPostConfirmation('Your post was published.');
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-zinc-900 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {postConfirmation && (
          <div role="status" className="absolute left-1/2 top-5 z-20 w-[min(90%,420px)] -translate-x-1/2 rounded-md border border-green-500/30 bg-green-950/95 px-5 py-3 text-center text-sm font-semibold text-green-200 shadow-xl">
            {postConfirmation}
          </div>
        )}

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

              {/* Compact post composer, expands when user clicks 'Start Post' */}
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
                        <button onClick={() =>{ setComposerExpanded(false); setNewPostText(''); setComposerTitle(''); setComposerMovie(''); }} className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded-lg">Cancel</button>
                        <button onClick={() =>{if (createPost()) { setComposerExpanded(false); setComposerTitle(''); setComposerMovie(''); } }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Post</button>
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
                  comments={commentsByActivity[activity.id] ||[]}
                  onSubmitComment={handleSubmitComment}
                />
              ))}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-6 space-y-5">
              <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800">
                <div className="h-24 bg-gradient-to-r from-red-700 via-zinc-800 to-zinc-950" />
                <div className="px-6 pb-6">
                  <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                      <img
                        src={profileAvatar}
                        alt="Your avatar"
                        className="h-24 w-24 rounded-full border-4 border-zinc-800 object-cover"
                      />
                      <div className="pb-1"> 
                        <h3 className="text-2xl font-bold">Your Name</h3> 
                        <p className="mt-1 max-w-xl text-sm leading-6 text-gray-300"> 
                          Tracking movie nights, recommendations, and conversations with friends.
                        </p>  
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">Edit Profile</button>
                      <button className="rounded-md bg-zinc-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-600">Settings</button>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <button onClick={() => setActiveProfileSection(current => current === 'followers' ? null : 'followers')} className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-3 text-left transition hover:border-zinc-500">
                      <div>
                        <div className="text-2xl font-bold">{followers.length}</div>
                        <div className="text-xs uppercase tracking-wide text-gray-400">Followers</div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showFollowers ? 'rotate-180' : ''}`} />
                    </button>
                    <button onClick={() => setActiveProfileSection(current => current === 'following' ? null : 'following')} className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-3 text-left transition hover:border-zinc-500">
                      <div>  
                        <div className="text-2xl font-bold">{following.length}</div>
                        <div className="text-xs uppercase tracking-wide text-gray-400">Following</div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showFollowing ? 'rotate-180' : ''}`} />
                    </button>
                    <button onClick={() => setActiveProfileSection(current => current === 'achievements' ? null : 'achievements')} className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-3 text-left transition hover:border-zinc-500">
                      <div>
                        <div className="text-2xl font-bold">{profileAchievements.filter((achievement) => achievement.achieved).length}</div>
                        <div className="text-xs uppercase tracking-wide text-gray-400">Achievements</div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAchievements ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {showFollowers && (
                <section className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
                  <h4 className="mb-3 font-bold">Followers</h4>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {followers.map((u) => (
                      <FriendCard key={u.name} user={u} onFollow={() => handleFollowByName(u.name)} />
                    ))}
                  </div>  
                </section>
              )}

              {showFollowing && (
                <section className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
                  <h4 className="mb-3 font-bold">Following</h4>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {following.map((u) => (
                      <FriendCard key={u.name} user={u} onFollow={() => handleFollowByName(u.name)} />
                    ))}
                  </div>
                </section>
              )}

              {showAchievements && (
                <section className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold">Achievements</h4>
                      <p className="text-sm text-gray-400">Milestones from your StreamSmart activity.</p>
                    </div>
                    <span className="rounded-full bg-red-600/15 px-3 py-1 text-xs font-semibold text-red-300">
                      {profileAchievements.filter((achievement) => achievement.achieved).length} unlocked
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {profileAchievements.map((achievement) => (
                      <div key={achievement.id} className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold">{achievement.title}</div>
                            <div className="mt-1 text-xs leading-5 text-gray-400">{achievement.description}</div>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            achievement.achieved
                              ? 'bg-green-500/15 text-green-300'
                              : 'bg-zinc-700 text-gray-300'
                          }`}>
                            {achievement.achieved ? 'Unlocked' : `${Math.round(achievement.progress * 100)}%`}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-zinc-700">
                          <div
                            className={`h-full ${achievement.achieved ? 'bg-green-500' : 'bg-red-600'}`}
                            style={{ width: `${achievement.progress * 100}%` }}
                          />
                        </div> 
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>   
                    <h4 className="font-bold">Recent Activity</h4>
                    <p className="text-sm text-gray-400">Your latest watch activity and social posts.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {userActivities.length > 0 ? (
                    userActivities.slice(0, 3).map(a => (
                      <ActivityCard key={a.id} activity={a} onLike={handleLike} onFollow={handleFollow} comments={commentsByActivity[a.id] || []} onSubmitComment={handleSubmitComment} />
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 p-6 text-center">
                      <div className="font-semibold text-gray-200">No recent activity yet</div>
                      <p className="mt-1 text-sm text-gray-400">Posts you create will show up here on your profile.</p>
                    </div>
                  )}
                </div>    
              </section>
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

// Card used for each post in the feed
function ActivityCard({ activity, onLike, onFollow, comments, onSubmitComment }: { activity: Activity; onLike: (id: number) => void; onFollow: (id: number) => void; comments?: {user:string; text:string}[]; onSubmitComment?: (id:number, text:string) => void }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const submit = () => {
    if (!onSubmitComment) return;

    // Parent post owns the real comment list, so this justs adds one
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
              alt={activity.movieTitle || 'Connected movie'}
              className="w-24 h-36 object-cover rounded flex-shrink-0"
            />
          ) : null}
          <div className="flex-1">
            {activity.movieTitle && (
              <h4 className="font-bold mb-2">{activity.movieTitle}</h4>
            )}
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

// Small card used in the followers and following dropdowns
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
