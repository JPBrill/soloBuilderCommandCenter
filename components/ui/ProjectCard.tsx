import React from 'react';
import { motion } from 'motion/react';
import { GitBranch, AlertCircle, Rocket } from 'lucide-react';

interface ProjectCardProps {
  name: string;
  description: string;
  deployStatus: 'success' | 'building' | 'error';
  prCount: number;
  issueCount: number;
  lastUpdated: string;
}

export function ProjectCard({
  name,
  description,
  deployStatus,
  prCount,
  issueCount,
  lastUpdated,
}: ProjectCardProps) {
  const statusColors = {
    success: 'text-emerald-400',
    building: 'text-yellow-400',
    error: 'text-red-400',
  };

  const statusIcons = {
    success: <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />,
    building: <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />,
    error: <div className="w-2 h-2 rounded-full bg-red-400" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass-panel rounded-xl p-6 relative overflow-hidden group transition-all duration-300 hover:border-aira-primary/50"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Rocket className="w-24 h-24 text-aira-primary" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-aira-text tracking-tight">{name}</h3>
            <p className="text-sm text-aira-text-muted mt-1">{description}</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-aira-bg-base/50 border border-white/5 ${statusColors[deployStatus]}`}>
            {statusIcons[deployStatus]}
            <span className="text-xs font-mono uppercase tracking-wider">{deployStatus}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-aira-bg-base/30 border border-white/5">
            <GitBranch className="w-5 h-5 text-aira-secondary" />
            <div>
              <div className="text-lg font-mono font-bold text-aira-text">{prCount}</div>
              <div className="text-xs text-aira-text-muted uppercase tracking-wider">Open PRs</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-aira-bg-base/30 border border-white/5">
            <AlertCircle className="w-5 h-5 text-aira-primary" />
            <div>
              <div className="text-lg font-mono font-bold text-aira-text">{issueCount}</div>
              <div className="text-xs text-aira-text-muted uppercase tracking-wider">Issues</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
          <span className="text-xs text-aira-text-muted font-mono">Updated {lastUpdated}</span>
          <button className="text-xs text-aira-primary hover:text-aira-primary-hover transition-colors font-medium uppercase tracking-wider">
            View Details →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
