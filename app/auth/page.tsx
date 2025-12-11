"use client";

import { useState } from "react";
import SignUpForm from "@/components/sign-up-form";
import SignInForm from "@/components/sign-in-form";

export default function OnboardingPage() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 dark:bg-rose-600/20 blur-[100px] rounded-full pointer-events-none" />

      {isLogin ? <SignInForm /> : <SignUpForm />}

      <div className="relative z-10 mt-6 text-center">
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-rose-600 dark:text-rose-400 font-medium hover:underline focus:outline-none"
          >
            {isLogin ? "Create Profile" : "Sign In"}
          </button>
        </p>
      </div>
    </main>
  );
}
