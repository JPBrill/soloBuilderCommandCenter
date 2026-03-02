'use client';

import { signIn } from "next-auth/react";
import { Github } from "lucide-react";

export function LoginButton() {
  return (
    <button
      onClick={() => signIn('github')}
      className="flex items-center gap-2 px-5 py-2.5 bg-aira-primary/10 hover:bg-aira-primary/20 text-aira-primary border border-aira-primary/50 rounded-lg transition-all duration-300 font-medium group backdrop-blur-sm"
    >
      <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span>Connect GitHub</span>
    </button>
  );
}
