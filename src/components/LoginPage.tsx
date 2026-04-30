import { FormEvent, useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';

// LoginPage is the first screen users see before entering the app, provides simple login form
interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  // mock data for login fields
  const [email, setEmail] = useState('example@email.com');
  const [password, setPassword] = useState('ex_password');
  const [showPassword, setShowPassword] = useState(false);

  // This stops the form from refreshing the page, then lets app show the main screen after entering
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin();
  };

  // Return the JSX that renders the login page
  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.25),transparent_28%),linear-gradient(135deg,#09090b_0%,#18181b_42%,#020617_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      </div>

      <main className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left side branding and welcome message */}
        <section className="grid min-h-[42vh] grid-rows-[auto_1fr] px-6 py-6 sm:px-10 lg:min-h-screen lg:px-14 lg:py-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-red-500">StreamSmart</span>
          </div>

          <div className="max-w-2xl self-center py-12 lg:py-0">
            <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Welcome to StreamSmart, the streaming service with a brain. 
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-zinc-300 sm:text-lg">
              Sign in to unlock AI-powered recommendations, social features, and personalized insights that make your movie nights smarter and more fun.
            </p>
          </div>

        </section>

        {/* Right side, sign in form */}
        <section className="flex items-center justify-center px-6 pb-8 sm:px-10 lg:px-14 lg:py-10">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-zinc-950/85 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Use the demo details or enter your own to view the StreamSmart dashboard.
              </p>
            </div>

            {/* Submitting this form logs into the main page*/}
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm text-zinc-300">Email address</span>
                <div className="flex h-12 items-center gap-3 rounded-md border border-zinc-700 bg-black/40 px-3 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20">
                  <Mail className="h-5 w-5 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-zinc-600"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-zinc-300">Password</span>
                <div className="flex h-12 items-center gap-3 rounded-md border border-zinc-700 bg-black/40 px-3 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20">
                  <LockKeyhole className="h-5 w-5 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-zinc-600"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="rounded p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {/* Swap icon based on if the password is visible */}
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-zinc-300">
                  <input type="checkbox" className="h-4 w-4 accent-red-600" defaultChecked />
                  Remember me
                </label>
                {/* Placeholder button, doesn't have reset logic yet*/}
                <button type="button" className="text-red-300 transition hover:text-red-200">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-red-600 px-4 font-semibold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Sign in
              </button>
            </form>

            <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-zinc-400">
              New to StreamSmart?{' '}
              {/* Placeholder button, doesn't create account yet */}
              <button type="button" className="font-semibold text-red-300 transition hover:text-red-200">
                Create an account
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
