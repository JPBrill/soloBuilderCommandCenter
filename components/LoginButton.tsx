'use client';

import { signIn } from "next-auth/react";
import { Github, AlertTriangle } from "lucide-react";
import { useState } from "react";

export function LoginButton() {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      // Check configuration first
      const res = await fetch('/api/debug/config');
      const config = await res.json();

      if (!config.hasGithubId || !config.hasGithubSecret) {
        setError("Missing GITHUB_ID or GITHUB_SECRET env vars.");
        alert(
          `Configuration Error:\n\n` +
          `Please set GITHUB_ID and GITHUB_SECRET in your .env file.\n\n` +
          `Callback URL for GitHub:\n${config.callbackUrl}`
        );
        return;
      }

      if (!config.hasNextAuthSecret) {
        setError("Missing NEXTAUTH_SECRET.");
        alert("Please set NEXTAUTH_SECRET in your .env file.");
        return;
      }

      // Proceed with login
      await signIn('github');
    } catch (err) {
      console.error("Login check failed:", err);
      // Fallback to trying login anyway if check fails
      signIn('github');
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleLogin}
        className="flex items-center gap-2 px-5 py-2.5 bg-aira-primary/10 hover:bg-aira-primary/20 text-aira-primary border border-aira-primary/50 rounded-lg transition-all duration-300 font-medium group backdrop-blur-sm"
      >
        <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span>Connect GitHub</span>
      </button>
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20">
          <AlertTriangle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}
