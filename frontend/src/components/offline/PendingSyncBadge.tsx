import { CloudOff } from 'lucide-react';

interface PendingSyncBadgeProps {
  count: number;
}

export const PendingSyncBadge = ({ count }: PendingSyncBadgeProps) => {
  if (count <= 0) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/50 text-amber-400 rounded-full text-xs font-medium animate-pulse">
      <CloudOff className="w-4 h-4" />
      {count} Pending Sync (Demo)
    </div>
  );
};
