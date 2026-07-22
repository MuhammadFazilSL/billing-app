import { useState, useEffect } from 'react';
import { WifiOff, X } from 'lucide-react';

export const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => {
      setIsOffline(true);
      setIsVisible(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline || !isVisible) return null;

  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2 flex items-center justify-between z-50 shadow-md">
      <div className="flex items-center gap-3">
        <WifiOff className="w-5 h-5" />
        <span className="text-sm font-medium">
          Offline Mode: You are not connected to the internet. New invoices will be saved locally.
        </span>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="p-1 hover:bg-amber-600/20 rounded-md transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
