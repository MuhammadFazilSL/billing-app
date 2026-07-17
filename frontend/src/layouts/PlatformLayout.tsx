import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PlatformSidebar } from './PlatformSidebar';
import { PlatformHeader } from './PlatformHeader';
import { RootState } from '../store/store';

export function PlatformLayout() {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Redirect to platform login if not authenticated or not a platform admin
  if (!accessToken || !user || user.role !== 'SUPER_ADMIN') {
    return <Navigate to="/platform/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <PlatformSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PlatformHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
