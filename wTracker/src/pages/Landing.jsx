import React from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation - Mobile App Style */}
      <nav className="w-full px-4 py-3 md:px-6 md:py-5 bg-white border-b border-gray-200 md:sticky md:top-0 md:z-50 md:bg-white/95 md:backdrop-blur-sm flex-shrink-0">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            w<span className="text-red-600">Tracker</span>
          </h1>
          <div className="flex gap-2 md:gap-4 items-center">
            <Link
              to="/login"
              className="text-sm md:text-base text-gray-700 font-semibold hover:text-red-600 active:text-red-600 transition-colors px-2 md:px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-red-600 text-white text-sm md:text-base px-4 md:px-5 py-2 md:py-2.5 rounded-full font-bold hover:bg-red-700 active:bg-red-700 transition-all shadow-md hover:shadow-lg active:scale-95 md:hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile-First Hero Section */}
      <main className="w-full flex-1">
        {/* Mobile Hero - App-like centered design */}
        <section className="px-4 py-10 md:hidden min-h-[calc(100vh-120px)] flex items-center">
          <div className="max-w-sm mx-auto text-center w-full">
            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight leading-tight">
              Track Every Rep.
            </h1>
            <p className="text-red-600 text-4xl font-black mb-5">
              Build Every Muscle.
            </p>
            <p className="text-base text-gray-600 mb-8 leading-relaxed">
              The simplest way to log your workouts and track your progress.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/register"
                className="wt-btn-primary w-full text-base py-4"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="w-full py-4 rounded-full border-2 border-gray-300 text-gray-700 font-bold active:border-red-500 active:text-red-600 transition-all text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Desktop Hero with Content Sections */}
        <section className="hidden md:block">
          {/* Hero */}
          <div className="max-w-5xl mx-auto px-6 py-20 lg:py-28">
            <div className="text-center mb-16">
              <h1 className="text-6xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                Track Every Rep.<br />
                <span className="text-red-600">Build Every Muscle.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                The simplest way to log your workouts and track your progress. Start building consistency today.
              </p>
              <div className="flex gap-4 justify-center items-center">
                <Link
                  to="/register"
                  className="wt-btn-primary text-base px-8 py-4"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 rounded-full border-2 border-gray-300 text-gray-700 font-bold hover:border-red-500 hover:text-red-600 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Why Track Your Lifts Section */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-10 lg:p-16 text-white mb-16">
              <h2 className="text-3xl lg:text-4xl font-black mb-8 text-center">
                Why Track Your Lifts?
              </h2>
              <div className="space-y-6 max-w-3xl mx-auto">
                <div>
                  <h3 className="text-xl font-black mb-2">Measure Real Progress</h3>
                  <p className="text-red-50 leading-relaxed">
                    Without tracking, you're guessing. See exactly how much stronger you've become over weeks and months. Numbers don't lie.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-black mb-2">Stay Consistent</h3>
                  <p className="text-red-50 leading-relaxed">
                    Tracking creates accountability. When you log every session, you build the habit of showing up. Consistency beats intensity.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-black mb-2">Avoid Plateaus</h3>
                  <p className="text-red-50 leading-relaxed">
                    Spot when you're stuck. If you've been lifting the same weight for weeks, your log will show it. Time to push harder.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-black mb-2">Build Confidence</h3>
                  <p className="text-red-50 leading-relaxed">
                    See your numbers go up. There's nothing more motivating than watching your strength grow week after week.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="mb-16">
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-8 text-center">
                How It Works
              </h2>
              <div className="bg-white rounded-3xl p-10 lg:p-16 border border-gray-200 shadow-sm max-w-3xl mx-auto">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-black text-red-600">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Start a Session</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Create a new workout log with date and notes. Takes seconds.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-black text-red-600">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Log Your Sets</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Add exercises and record sets, reps, and weights as you go.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-black text-red-600">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Track Progress</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Review your history and see your strength gains over time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-auto py-2.5 md:py-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center text-gray-500 text-xs md:text-sm">
          <p className="leading-tight py-0.5">
            w<span className="text-red-600 font-semibold">Tracker</span> — Simple workout tracking
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
