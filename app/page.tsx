import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white px-4 py-12 sm:px-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-rose-500/10 dark:bg-rose-600/20 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-lg md:max-w-2xl text-center space-y-6 md:space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-medium transition-colors">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>AI-Powered Tattoo Analysis</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 pb-2">
          InkSesh
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed transition-colors px-2 sm:px-0">
          Turn your chaotic Instagram feed into a structured, searchable
          portfolio. We use AI to tag your tattoos by style, body part, and
          theme automatically.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            href="/auth"
            className="group relative inline-flex h-12 w-full sm:w-auto items-center justify-center overflow-hidden rounded-md bg-neutral-900 dark:bg-white px-8 font-medium text-white dark:text-neutral-950 transition-all duration-300 hover:bg-neutral-800 dark:hover:bg-neutral-200 hover:scale-[1.02] sm:hover:scale-105 shadow-lg shadow-neutral-500/20 dark:shadow-none"
          >
            <span className="mr-2">Get Started</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/discover"
            className="inline-flex h-12 w-full sm:w-auto items-center justify-center px-8 font-medium text-neutral-900 dark:text-white transition-colors hover:text-rose-600 dark:hover:text-rose-400 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 rounded-md sm:border-none"
          >
            Browse Gallery
          </Link>
        </div>
      </div>
    </main>
  );
}
