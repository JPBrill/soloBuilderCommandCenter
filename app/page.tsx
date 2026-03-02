'use client';

import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Terminal, 
  Command, 
  Github, 
  LayoutDashboard, 
  Settings,
  Search,
  MessageSquare,
  Cpu,
  Activity
} from 'lucide-react';
import { ProjectCard } from '@/components/ui/ProjectCard';

export default function Dashboard() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResponse('');
    
    try {
      // Attempt to use client-side key first (exposed via next.config.ts)
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        setResponse(result.text || 'No response generated.');
      } else {
        // Fallback to server-side route if client key is not available
        const res = await fetch('/api/test-gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setResponse(data.text);
      }
    } catch (error: any) {
      console.error("AI Error:", error);
      setResponse(`Error: ${error.message || 'Something went wrong'}`);
    } finally {
      setLoading(false);
    }
  };

  const projects = [
    {
      name: "Project Alpha",
      description: "Next.js e-commerce platform with Stripe integration",
      deployStatus: "success" as const,
      prCount: 2,
      issueCount: 5,
      lastUpdated: "2h ago"
    },
    {
      name: "Project Beta",
      description: "Internal dashboard for analytics visualization",
      deployStatus: "building" as const,
      prCount: 0,
      issueCount: 1,
      lastUpdated: "5m ago"
    },
    {
      name: "Project Gamma",
      description: "Mobile app backend API service",
      deployStatus: "error" as const,
      prCount: 12,
      issueCount: 3,
      lastUpdated: "1d ago"
    }
  ];

  return (
    <div className="min-h-screen bg-aira-bg-base text-aira-text p-6 md:p-12 font-sans selection:bg-aira-primary/30">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-aira-primary/10 rounded-lg border border-aira-primary/20">
                <LayoutDashboard className="w-6 h-6 text-aira-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
            </div>
            <p className="text-aira-text-muted">Welcome back, Builder. System status: <span className="text-emerald-400">Operational</span></p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative group">
              <Search className="w-5 h-5 text-aira-text-muted group-hover:text-aira-text" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative group">
              <Settings className="w-5 h-5 text-aira-text-muted group-hover:text-aira-text" />
            </button>
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <div className="flex items-center gap-3 pl-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-aira-primary to-aira-secondary" />
              <div className="hidden md:block">
                <div className="text-sm font-medium">Alex Dev</div>
                <div className="text-xs text-aira-text-muted">Pro Plan</div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* AI Assistant Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-xl p-6 border border-aira-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-aira-primary via-aira-secondary to-aira-primary opacity-50" />
              
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-aira-primary" />
                <h2 className="text-xl font-bold">AI Assistant</h2>
              </div>

              <div className="bg-aira-bg-elevated/50 rounded-lg p-4 min-h-[200px] mb-4 border border-white/5 font-mono text-sm overflow-y-auto max-h-[400px]">
                {response ? (
                  <div className="whitespace-pre-wrap">{response}</div>
                ) : (
                  <div className="text-aira-text-muted flex flex-col items-center justify-center h-full gap-2 opacity-50">
                    <Cpu className="w-8 h-8" />
                    <p>System ready. Awaiting input...</p>
                  </div>
                )}
                {loading && (
                  <div className="flex items-center gap-2 text-aira-primary mt-4 animate-pulse">
                    <Activity className="w-4 h-4" />
                    <span>Processing request...</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleAskAI} className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Terminal className="w-4 h-4 text-aira-text-muted" />
                </div>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask Gemini to analyze deployment logs..."
                  className="w-full bg-aira-bg-base border border-white/10 rounded-lg py-3 pl-10 pr-12 focus:outline-none focus:border-aira-primary/50 focus:ring-1 focus:ring-aira-primary/50 transition-all placeholder:text-aira-text-muted/50"
                />
                <button 
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-aira-primary/10 hover:bg-aira-primary/20 text-aira-primary rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Command className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-6">
            <div className="glass-panel rounded-xl p-6 h-full">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-aira-secondary" />
                Recent Activity
              </h2>
              
              <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative pl-10 group">
                    <div className="absolute left-[15px] top-1.5 w-2 h-2 rounded-full bg-aira-bg-surface border border-white/20 group-hover:border-aira-primary group-hover:bg-aira-primary transition-colors z-10" />
                    <div className="text-sm">
                      <span className="text-aira-primary font-medium">deployment-#{1020 + i}</span>
                      <span className="text-aira-text-muted"> was triggered by </span>
                      <span className="text-white">main</span>
                    </div>
                    <div className="text-xs text-aira-text-muted mt-1 font-mono">
                      {i * 15}m ago
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
