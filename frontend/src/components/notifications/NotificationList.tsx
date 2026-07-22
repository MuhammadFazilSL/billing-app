import { Notification } from '../../api/notifications';
import { NotificationCard } from './NotificationCard';
import { NotificationEmpty } from './NotificationEmpty';
import { NotificationSkeleton } from './NotificationSkeleton';

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  onRead: (id: string) => void;
  onDelete?: (id: string) => void;
  onClickUrl?: (url: string) => void;
}

export const NotificationList = ({
  notifications,
  isLoading,
  onRead,
  onDelete,
  onClickUrl,
}: NotificationListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <NotificationSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return <NotificationEmpty />;
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onRead={onRead}
          onDelete={onDelete}
          onClickUrl={onClickUrl}
        />
      ))}
    </div>
  );
};
