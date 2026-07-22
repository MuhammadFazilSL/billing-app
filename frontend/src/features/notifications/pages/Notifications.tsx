import { useState, useEffect } from 'react';
import { BellRing, Filter, Check, RefreshCw } from 'lucide-react';
import { getNotifications, markAllAsRead, markAsRead, deleteNotification, Notification } from '../../../api/notifications';
import { NotificationList } from '../../../components/notifications/NotificationList';

const MODULES = ['Billing', 'Inventory', 'Purchases', 'Customers', 'Employees', 'Platform', 'System'];
const TYPES = ['SUCCESS', 'INFO', 'WARNING', 'ERROR'];

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [filterModule, setFilterModule] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterIsRead, setFilterIsRead] = useState<string>(''); // '', 'true', 'false'

  useEffect(() => {
    fetchNotifications();
  }, [page, filterModule, filterType, filterIsRead]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await getNotifications({
        page,
        limit: 20,
        module: filterModule || undefined,
        type: filterType || undefined,
        isRead: filterIsRead === 'true' ? true : filterIsRead === 'false' ? false : undefined,
      });
      setNotifications(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <BellRing className="w-6 h-6" />
            </div>
            Activity & Notifications
          </h1>
          <p className="text-gray-400 mt-1">Stay updated on important events across your business.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={fetchNotifications}
            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
            Mark all read
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <select
          value={filterModule}
          onChange={(e) => { setFilterModule(e.target.value); setPage(1); }}
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Modules</option>
          {MODULES.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Types</option>
          {TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={filterIsRead}
          onChange={(e) => { setFilterIsRead(e.target.value); setPage(1); }}
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 min-h-[400px]">
        <NotificationList
          notifications={notifications}
          isLoading={isLoading}
          onRead={handleMarkAsRead}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 rounded-lg transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
