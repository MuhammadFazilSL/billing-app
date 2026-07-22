import { CheckCircle, AlertCircle, Info, XCircle, Link as LinkIcon, Trash2 } from 'lucide-react';
import { Notification } from '../../api/notifications';

interface NotificationCardProps {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete?: (id: string) => void;
  onClickUrl?: (url: string) => void;
}

const icons = {
  SUCCESS: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  INFO: <Info className="w-5 h-5 text-blue-500" />,
  WARNING: <AlertCircle className="w-5 h-5 text-amber-500" />,
  ERROR: <XCircle className="w-5 h-5 text-red-500" />,
};

const bgColors = {
  SUCCESS: 'bg-emerald-500/10',
  INFO: 'bg-blue-500/10',
  WARNING: 'bg-amber-500/10',
  ERROR: 'bg-red-500/10',
};

export const NotificationCard = ({ notification, onRead, onDelete, onClickUrl }: NotificationCardProps) => {
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`group relative flex items-start gap-4 p-4 rounded-xl transition-all duration-200 border ${
        notification.isRead
          ? 'bg-white/5 border-white/5 opacity-70 hover:opacity-100'
          : 'bg-white/10 border-white/10 shadow-lg'
      }`}
    >
      <div className={`p-2 rounded-lg ${bgColors[notification.type] || bgColors.INFO}`}>
        {icons[notification.type] || icons.INFO}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className={`text-sm font-semibold truncate ${notification.isRead ? 'text-gray-400' : 'text-gray-200'}`}>
            {notification.title}
          </h4>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {getRelativeTime(notification.createdAt)}
          </span>
        </div>
        
        <p className={`text-sm line-clamp-2 ${notification.isRead ? 'text-gray-500' : 'text-gray-400'}`}>
          {notification.message}
        </p>

        <div className="flex items-center gap-2 mt-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
            {notification.module}
          </span>
          
          {notification.actionUrl && (
            <button
              onClick={() => onClickUrl?.(notification.actionUrl!)}
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              <LinkIcon className="w-3 h-3" />
              View Details
            </button>
          )}
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-[#18181b] pl-2">
        {!notification.isRead && (
          <button
            onClick={() => onRead(notification.id)}
            className="p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-white/5 rounded-md transition-colors"
            title="Mark as read"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(notification.id)}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-md transition-colors"
            title="Delete notification"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
