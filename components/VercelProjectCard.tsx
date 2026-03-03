'use client';

import { motion } from 'motion/react';
import { Rocket, Clock, ExternalLink, Globe, Activity } from 'lucide-react';
import { VercelProject } from '@/lib/vercel';

interface VercelProjectCardProps {
  project: VercelProject;
}

export function VercelProjectCard({ project }: VercelProjectCardProps) {
  const latestDeployment = project.latestDeployments?.[0];
  const state = latestDeployment?.state || 'INITIALIZING';

  const stateColors = {
    READY: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10',
    ERROR: 'text-red-400 border-red-400/20 bg-red-400/10',
    BUILDING: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10',
    CANCELED: 'text-aira-text-muted border-white/10 bg-white/5',
    INITIALIZING: 'text-aira-primary border-aira-primary/20 bg-aira-primary/10',
  };

  const stateIcons = {
    READY: <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />,
    ERROR: <div className="w-2 h-2 rounded-full bg-red-400" />,
    BUILDING: <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />,
    CANCELED: <div className="w-2 h-2 rounded-full bg-aira-text-muted" />,
    INITIALIZING: <div className="w-2 h-2 rounded-full bg-aira-primary animate-pulse" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass-panel rounded-xl p-6 relative overflow-hidden group transition-all duration-300 hover:border-aira-primary/50 flex flex-col h-full"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Globe className="w-24 h-24 text-aira-primary" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-lg font-bold text-aira-text tracking-tight truncate" title={project.name}>
              {project.name}
            </h3>
            <p className="text-sm text-aira-text-muted mt-1">
              {project.framework ? `Framework: ${project.framework}` : 'No framework detected'}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border ${stateColors[state]}`}>
            {stateIcons[state]}
            <span className="text-[10px] font-mono uppercase tracking-wider">{state}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-aira-bg-base/30 border border-white/5">
            <Activity className="w-4 h-4 text-aira-secondary" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-mono font-bold text-aira-text truncate">
                {latestDeployment?.url || 'No deployment'}
              </div>
              <div className="text-[10px] text-aira-text-muted uppercase tracking-wider">Latest URL</div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-xs text-aira-text-muted font-mono">
            <Clock className="w-3 h-3" />
            <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
          </div>
          {latestDeployment?.url && (
            <a 
              href={`https://${latestDeployment.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-aira-primary hover:text-aira-primary-hover transition-colors font-medium uppercase tracking-wider flex items-center gap-1"
            >
              Visit <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
