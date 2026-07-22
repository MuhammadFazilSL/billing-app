export const NotificationSkeleton = () => {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-white/10 shrink-0" />
      <div className="flex-1 min-w-0 py-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="h-4 bg-white/10 rounded w-1/3" />
          <div className="h-3 bg-white/10 rounded w-16" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-white/10 rounded w-full" />
          <div className="h-3 bg-white/10 rounded w-4/5" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-5 bg-white/10 rounded w-16" />
        </div>
      </div>
    </div>
  );
};
