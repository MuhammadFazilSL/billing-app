import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ fullScreen = false, message }) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center p-8 w-full h-full';

  return (
    <div className={containerClass}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {message && <p className="mt-4 text-sm text-muted-foreground animate-pulse">{message}</p>}
    </div>
  );
};
