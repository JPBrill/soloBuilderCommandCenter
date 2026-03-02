'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { GoogleGenAI } from '@google/genai';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Terminal, 
  Command, 
  LayoutDashboard, 
  Settings,
  Search,
  Cpu,
  Activity,
  LogOut,
  Github
} from 'lucide-react';
import { ProjectCard } from '@/components/ProjectCard';
import { LoginButton } from '@/components/LoginButton';
import { GitHubRepo } from '@/lib/github';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [reposLoading, setReposLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setReposLoading(true);
      fetch('/api/user/repos')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setRepos(data);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setReposLoading(false));
    }
  }, [session]);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResponse('');
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        setResponse(result.text || 'No response generated.');
      } else {
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-aira-bg-base flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-aira-primary/20 border border-aira-primary/50" />
          <div className="text-aira-text-muted font-mono text-sm">Initializing System...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-aira-bg-base flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-aira-primary/10 via-transparent to-transparent opacity-50" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md space-y-8"
        >
          <div className="mx-auto w-20 h-20 bg-aira-bg-elevated rounded-2xl border border-aira-primary/30 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(53,189,248,0.3)]">
            <LayoutDashboard className="w-10 h-10 text-aira-primary" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-aira-text">
              Solo Builder <span className="text-aira-primary">Command Center</span>
            </h1>
            <p className="text-aira-text-muted text-lg">
              Connect your GitHub to access your personal dashboard with AI-powered insights.
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <LoginButton />
          </div>
        </motion.div>
      </div>
    );
  }

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
            <p className="text-aira-text-muted">
              Welcome back, <span className="text-aira-text font-medium">{session.user?.name}</span>. 
              System status: <span className="text-emerald-400">Operational</span>
            </p>
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
              {session.user?.image ? (
                <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full border border-white/10" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-aira-primary to-aira-secondary" />
              )}
              <button 
                onClick={() => signOut()}
                className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors text-aira-text-muted"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Repos Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Github className="w-5 h-5 text-aira-text" />
              Active Repositories
            </h2>
            {reposLoading && <div className="text-xs text-aira-primary animate-pulse font-mono">SYNCING...</div>}
          </div>
          
          {reposLoading && repos.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {repos.map((repo) => (
                <ProjectCard key={repo.id} repo={repo} />
              ))}
              {repos.length === 0 && !reposLoading && (
                <div className="col-span-3 py-12 text-center text-aira-text-muted border border-dashed border-white/10 rounded-xl">
                  No repositories found.
                </div>
              )}
            </div>
          )}
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
                  placeholder="Ask Gemini to analyze your repos..."
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
