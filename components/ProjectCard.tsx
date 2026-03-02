'use client';

import { motion } from 'motion/react';
import { GitBranch, AlertCircle, Clock, ExternalLink, Rocket } from 'lucide-react';
import { GitHubRepo } from '@/lib/github';

interface ProjectCardProps {
  repo: GitHubRepo;
}

export function ProjectCard({ repo }: ProjectCardProps) {
  // Mock deploy status for now as requested
  const statuses = ['success', 'building', 'idle'] as const;
  const deployStatus = statuses[repo.id % 3]; // Deterministic mock status based on ID

  const statusColors = {
    success: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10',
    building: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10',
    idle: 'text-aira-text-muted border-white/10 bg-white/5',
  };

  const statusIcons = {
    success: <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />,
    building: <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />,
    idle: <div className="w-2 h-2 rounded-full bg-aira-text-muted" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass-panel rounded-xl p-6 relative overflow-hidden group transition-all duration-300 hover:border-aira-primary/50 flex flex-col h-full"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Rocket className="w-24 h-24 text-aira-primary" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-lg font-bold text-aira-text tracking-tight truncate" title={repo.name}>
              {repo.name}
            </h3>
            <p className="text-sm text-aira-text-muted mt-1 line-clamp-2 h-10">
              {repo.description || "No description provided."}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border ${statusColors[deployStatus]}`}>
            {statusIcons[deployStatus]}
            <span className="text-[10px] font-mono uppercase tracking-wider">{deployStatus}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-aira-bg-base/30 border border-white/5">
            <GitBranch className="w-4 h-4 text-aira-secondary" />
            <div>
              <div className="text-sm font-mono font-bold text-aira-text">{repo.open_prs_count ?? 0}</div>
              <div className="text-[10px] text-aira-text-muted uppercase tracking-wider">Open PRs</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-aira-bg-base/30 border border-white/5">
            <AlertCircle className="w-4 h-4 text-aira-primary" />
            <div>
              <div className="text-sm font-mono font-bold text-aira-text">{repo.open_issues_count}</div>
              <div className="text-[10px] text-aira-text-muted uppercase tracking-wider">Issues</div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-xs text-aira-text-muted font-mono">
            <Clock className="w-3 h-3" />
            <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
          </div>
          <a 
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-aira-primary hover:text-aira-primary-hover transition-colors font-medium uppercase tracking-wider flex items-center gap-1"
          >
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
