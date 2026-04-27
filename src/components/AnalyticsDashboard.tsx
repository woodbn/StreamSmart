import { useState } from 'react';
import {
  X,
  BarChart3,
  Clock,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Zap,
  Heart,
  Film,
  Tv,
  Star,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimeRange = 'week' | 'month' | 'year';

/**
 * Mock analytics dataset used by the dashboard.
 *
 * The selected time range controls which values are displayed.
 * This makes the Week / Month / Year buttons update the actual
 * dashboard content instead of only changing button styling.
 */
const analyticsData = {
  week: {
    label: 'This Week',
    watchTime: '18 hrs',
    watchTimeChange: '+6%',
    movies: '6',
    movieChange: '+2',
    episodes: '22',
    episodeChange: '+8',
    achievements: '3',
    achievementChange: '+1',
    topGenre: 'Drama',
    averageRating: '4.1',
    completionRate: 68,
    watchlistProgress: 34,
    genres: [
      { label: 'Drama', percentage: 31, color: 'bg-purple-500' },
      { label: 'Comedy', percentage: 24, color: 'bg-yellow-500' },
      { label: 'Sci-Fi', percentage: 21, color: 'bg-blue-500' },
      { label: 'Action', percentage: 16, color: 'bg-red-500' },
      { label: 'Documentary', percentage: 8, color: 'bg-green-500' },
    ],
    activity: [
      { day: 'Mon', hours: 1.2 },
      { day: 'Tue', hours: 2.0 },
      { day: 'Wed', hours: 1.5 },
      { day: 'Thu', hours: 2.8 },
      { day: 'Fri', hours: 4.2 },
      { day: 'Sat', hours: 3.5 },
      { day: 'Sun', hours: 2.8 },
    ],
    moods: [
      { emoji: '😂', label: 'Entertained', count: 5, percentage: 34 },
      { emoji: '🤯', label: 'Mind-blown', count: 4, percentage: 27 },
      { emoji: '😢', label: 'Emotional', count: 3, percentage: 20 },
      { emoji: '💪', label: 'Energized', count: 3, percentage: 19 },
    ],
    insights: [
      'You watched most on Friday night, which suggests weekends are your strongest viewing window.',
      'Drama was your top genre this week, but you also mixed in comedy and sci-fi.',
      'You completed 68% of the titles you started, so your follow-through is slightly below your monthly average.',
      'Your watchlist progress is 34%, meaning you added more titles than you finished this week.',
    ],
  },
  month: {
    label: 'This Month',
    watchTime: '142 hrs',
    watchTimeChange: '+23%',
    movies: '47',
    movieChange: '+12',
    episodes: '156',
    episodeChange: '+34',
    achievements: '28',
    achievementChange: '+5',
    topGenre: 'Sci-Fi',
    averageRating: '4.4',
    completionRate: 72,
    watchlistProgress: 58,
    genres: [
      { label: 'Sci-Fi', percentage: 35, color: 'bg-blue-500' },
      { label: 'Action', percentage: 28, color: 'bg-red-500' },
      { label: 'Drama', percentage: 18, color: 'bg-purple-500' },
      { label: 'Comedy', percentage: 12, color: 'bg-yellow-500' },
      { label: 'Horror', percentage: 7, color: 'bg-green-500' },
    ],
    activity: [
      { day: 'Mon', hours: 2.5 },
      { day: 'Tue', hours: 1.8 },
      { day: 'Wed', hours: 3.2 },
      { day: 'Thu', hours: 2.1 },
      { day: 'Fri', hours: 5.5 },
      { day: 'Sat', hours: 6.0 },
      { day: 'Sun', hours: 4.7 },
    ],
    moods: [
      { emoji: '🤯', label: 'Mind-blown', count: 18, percentage: 32 },
      { emoji: '😂', label: 'Entertained', count: 15, percentage: 27 },
      { emoji: '😢', label: 'Emotional', count: 12, percentage: 21 },
      { emoji: '💪', label: 'Energized', count: 11, percentage: 20 },
    ],
    insights: [
      'You watch 65% more content on weekends. Your strongest viewing time is Friday night around 9 PM.',
      'Your top genre this month is Sci-Fi, making up 35% of your total watch activity.',
      'You finish 72% of the series you start, which suggests you usually continue shows after the first few episodes.',
      'Your average rating is 4.4, meaning your recommendations are matching your preferences well this month.',
    ],
  },
  year: {
    label: 'This Year',
    watchTime: '1,240 hrs',
    watchTimeChange: '+18%',
    movies: '312',
    movieChange: '+74',
    episodes: '1,804',
    episodeChange: '+410',
    achievements: '96',
    achievementChange: '+22',
    topGenre: 'Action',
    averageRating: '4.2',
    completionRate: 76,
    watchlistProgress: 81,
    genres: [
      { label: 'Action', percentage: 30, color: 'bg-red-500' },
      { label: 'Sci-Fi', percentage: 26, color: 'bg-blue-500' },
      { label: 'Drama', percentage: 20, color: 'bg-purple-500' },
      { label: 'Comedy', percentage: 15, color: 'bg-yellow-500' },
      { label: 'Documentary', percentage: 9, color: 'bg-green-500' },
    ],
    activity: [
      { day: 'Mon', hours: 2.1 },
      { day: 'Tue', hours: 2.4 },
      { day: 'Wed', hours: 2.9 },
      { day: 'Thu', hours: 3.1 },
      { day: 'Fri', hours: 5.8 },
      { day: 'Sat', hours: 6.2 },
      { day: 'Sun', hours: 5.4 },
    ],
    moods: [
      { emoji: '😂', label: 'Entertained', count: 124, percentage: 31 },
      { emoji: '🤯', label: 'Mind-blown', count: 108, percentage: 27 },
      { emoji: '💪', label: 'Energized', count: 92, percentage: 23 },
      { emoji: '😢', label: 'Emotional', count: 74, percentage: 19 },
    ],
    insights: [
      'Across the year, your viewing pattern is highly weekend-focused, especially Saturday evenings.',
      'Action is your top yearly genre, but Sci-Fi remains a close second.',
      'You finish 76% of the series you start, which is stronger than your weekly and monthly completion rates.',
      'Your watchlist progress is 81%, meaning you are steadily working through saved titles instead of only adding new ones.',
    ],
  },
};

export function AnalyticsDashboard({ isOpen, onClose }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  if (!isOpen) return null;

  const data = analyticsData[timeRange];
  const maxActivityHours = Math.max(...data.activity.map((item) => item.hours));

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 text-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Your Viewing Analytics</h2>
              <p className="text-sm text-white/80">
                Personalized insights based on your {data.label.toLowerCase()} activity
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
            aria-label="Close analytics dashboard"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Time range selector */}
        <div className="bg-zinc-800 p-4 border-b border-zinc-700">
          <div className="flex flex-wrap gap-2">
            {(['week', 'month', 'year'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition ${
                  timeRange === range
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
                }`}
              >
                {analyticsData[range].label}
              </button>
            ))}
          </div>
        </div>

        {/* Main dashboard content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Summary metric cards */}
          <section className="mb-8">
            <div className="mb-4">
              <h3 className="text-xl font-bold">Summary</h3>
              <p className="text-sm text-gray-400">
                Quick snapshot of your viewing behavior for {data.label.toLowerCase()}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <MetricCard
                icon={<Clock className="w-6 h-6 text-blue-500" />}
                label="Watch Time"
                value={data.watchTime}
                change={data.watchTimeChange}
                isPositive={true}
              />

              <MetricCard
                icon={<Film className="w-6 h-6 text-purple-500" />}
                label="Movies Watched"
                value={data.movies}
                change={data.movieChange}
                isPositive={true}
              />

              <MetricCard
                icon={<Tv className="w-6 h-6 text-green-500" />}
                label="TV Episodes"
                value={data.episodes}
                change={data.episodeChange}
                isPositive={true}
              />

              <MetricCard
                icon={<Award className="w-6 h-6 text-yellow-500" />}
                label="Achievements"
                value={data.achievements}
                change={data.achievementChange}
                isPositive={true}
              />
            </div>

            {/* Netflix-style behavioral analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <NetflixMetricCard
                icon={<Target className="w-5 h-5 text-indigo-400" />}
                label="Top Genre"
                value={data.topGenre}
                helper={`${data.genres[0].percentage}% of your viewing`}
              />

              <NetflixMetricCard
                icon={<Star className="w-5 h-5 text-yellow-400" />}
                label="Average Rating"
                value={`${data.averageRating}/5`}
                helper="Based on your ratings"
              />

              <NetflixMetricCard
                icon={<CheckCircle2 className="w-5 h-5 text-green-400" />}
                label="Completion Rate"
                value={`${data.completionRate}%`}
                helper="Series and movies finished"
              />

              <NetflixMetricCard
                icon={<Bookmark className="w-5 h-5 text-pink-400" />}
                label="Watchlist Progress"
                value={`${data.watchlistProgress}%`}
                helper="Saved titles completed"
              />
            </div>
          </section>

          {/* Charts section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartPanel
              title="Genre Preferences"
              subtitle={`Your strongest genre is ${data.topGenre}.`}
              icon={<Target className="w-5 h-5 text-indigo-500" />}
            >
              <div className="space-y-3">
                {data.genres.map((genre) => (
                  <GenreBar
                    key={genre.label}
                    label={genre.label}
                    percentage={genre.percentage}
                    color={genre.color}
                  />
                ))}
              </div>
            </ChartPanel>

            <ChartPanel
              title="Viewing Activity"
              subtitle="Shows when you are most active during the week."
              icon={<Calendar className="w-5 h-5 text-purple-500" />}
            >
              <div className="space-y-3">
                {data.activity.map((item) => (
                  <ActivityBar
                    key={item.day}
                    day={item.day}
                    hours={item.hours}
                    maxHours={maxActivityHours}
                  />
                ))}
              </div>
            </ChartPanel>
          </section>

          {/* Mood analytics */}
          <section className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 mb-8">
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Your Viewing Moods
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Mood tags help explain why certain recommendations fit your current taste.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.moods.map((mood) => (
                <MoodCard
                  key={mood.label}
                  emoji={mood.emoji}
                  label={mood.label}
                  count={mood.count}
                  percentage={mood.percentage}
                />
              ))}
            </div>
          </section>

          {/* Achievement progress */}
          <section className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Recent Achievements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AchievementCard
                icon="🎬"
                title="Cinephile"
                description="Watched 50 movies"
                unlocked={true}
              />

              <AchievementCard
                icon="🌙"
                title="Night Owl"
                description="10 movies after midnight"
                unlocked={true}
              />

              <AchievementCard
                icon="🎭"
                title="Genre Explorer"
                description="Watched 5+ genres"
                unlocked={true}
              />

              <AchievementCard
                icon="📚"
                title="Series Binger"
                description="Complete 3 series"
                unlocked={false}
                progress={67}
              />

              <AchievementCard
                icon="⭐"
                title="Critic"
                description="Write 25 reviews"
                unlocked={false}
                progress={52}
              />

              <AchievementCard
                icon="⭐"
                title="Community Critic"
                description="Rate 25 titles"
                unlocked={false}
                progress={30}
              />
            </div>
          </section>

          {/* Viewing streaks */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <StreakCard
              label="Current Streak"
              value="12 days"
              icon="🔥"
              color="text-orange-500"
            />

            <StreakCard
              label="Longest Streak"
              value="28 days"
              icon="🏆"
              color="text-yellow-500"
            />

            <StreakCard
              label="Avg. Daily Watch"
              value={
                timeRange === 'week'
                  ? '2.6 hrs'
                  : timeRange === 'month'
                    ? '4.2 hrs'
                    : '3.4 hrs'
              }
              icon="⏱️"
              color="text-blue-500"
            />
          </section>

          {/* Personalized insights */}
          <section className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-700/50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Personalized Insights
            </h3>

            <p className="text-sm text-gray-300 mb-4">
              These explain what the numbers mean instead of only showing raw statistics.
            </p>

            <div className="space-y-3">
              {data.insights.map((insight, index) => (
                <InsightItem
                  key={insight}
                  text={insight}
                  icon={['📊', '🎯', '✅', '✨'][index] ?? '✨'}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/**
 * Displays a primary summary metric such as watch time,
 * movies watched, TV episodes watched, or achievements.
 */
function MetricCard({
  icon,
  label,
  value,
  change,
  isPositive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}) {
  return (
    <div className="bg-zinc-800 rounded-lg p-5 border border-zinc-700">
      <div className="flex items-center justify-between mb-3">
        {icon}
        <span className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
      </div>

      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

/**
 * Displays Netflix-style user behavior metrics such as
 * top genre, average rating, completion rate, and watchlist progress.
 */
function NetflixMetricCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="bg-zinc-800 rounded-lg p-5 border border-zinc-700">
      <div className="flex items-center gap-2 text-gray-300 mb-3">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
      </div>

      <div className="text-2xl font-bold mb-1">{value}</div>
      <p className="text-xs text-gray-400">{helper}</p>
    </div>
  );
}

/**
 * Reusable panel container for chart-style dashboard sections.
 */
function ChartPanel({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
      <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
        {icon}
        {title}
      </h3>

      <p className="text-sm text-gray-400 mb-4">{subtitle}</p>
      {children}
    </div>
  );
}

/**
 * Horizontal progress bar for genre preference percentages.
 */
function GenreBar({
  label,
  percentage,
  color,
}: {
  label: string;
  percentage: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-sm text-gray-400">{percentage}%</span>
      </div>

      <div className="w-full bg-zinc-700 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Horizontal progress bar for average watch activity by day.
 */
function ActivityBar({
  day,
  hours,
  maxHours,
}: {
  day: string;
  hours: number;
  maxHours: number;
}) {
  const percentage = (hours / maxHours) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 text-sm font-semibold">{day}</div>

      <div className="flex-1">
        <div className="w-full bg-zinc-700 rounded-full h-6 relative">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
            style={{ width: `${percentage}%` }}
          >
            <span className="text-xs font-semibold">{hours}h</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Shows user mood categories collected from viewing feedback.
 */
function MoodCard({
  emoji,
  label,
  count,
  percentage,
}: {
  emoji: string;
  label: string;
  count: number;
  percentage: number;
}) {
  return (
    <div className="bg-zinc-700 rounded-lg p-4 text-center">
      <div className="text-4xl mb-2">{emoji}</div>
      <div className="text-xl font-bold mb-1">{count}</div>
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className="text-xs text-gray-500">{percentage}% of total</div>
    </div>
  );
}

/**
 * Displays achievement status and progress.
 */
function AchievementCard({
  icon,
  title,
  description,
  unlocked,
  progress,
}: {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number;
}) {
  return (
    <div
      className={`rounded-lg p-4 border-2 ${
        unlocked
          ? 'bg-yellow-900/20 border-yellow-600'
          : 'bg-zinc-700/50 border-zinc-600'
      }`}
    >
      <div className="text-4xl mb-2 text-center">{icon}</div>
      <h4 className="font-bold text-center mb-1">{title}</h4>
      <p className="text-sm text-gray-400 text-center mb-2">{description}</p>

      {!unlocked && progress !== undefined && (
        <>
          <div className="w-full bg-zinc-600 rounded-full h-2 mb-1">
            <div
              className="bg-yellow-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-xs text-center text-gray-400">
            {progress}% complete
          </div>
        </>
      )}

      {unlocked && (
        <div className="text-center text-yellow-500 text-sm font-semibold">
          Unlocked! 🎉
        </div>
      )}
    </div>
  );
}

/**
 * Shows viewing streaks and daily viewing habits.
 */
function StreakCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-5 text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <div className={`text-2xl font-bold mb-1 ${color}`}>{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

/**
 * Displays a user-centered explanation of what the analytics mean.
 */
function InsightItem({ text, icon }: { text: string; icon: string }) {
  return (
    <div className="flex items-start gap-3 bg-black/30 rounded-lg p-4">
      <span className="text-2xl">{icon}</span>
      <p className="text-sm text-gray-300 flex-1">{text}</p>
    </div>
  );
}