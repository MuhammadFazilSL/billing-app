import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const usePermission = (requiredPermission: string): boolean => {
  const { user, permissions } = useSelector((state: RootState) => state.auth);

  // Unauthenticated users have no permissions
  if (!user) return false;

  // Master Admin (Tenant Owner) always has full access within their tenant
  if (user.isMasterAdmin) return true;

  // Super Admin (Platform Admin) has full access, indicated by '*'
  if (permissions.includes('*')) return true;

  return permissions.includes(requiredPermission);
};
