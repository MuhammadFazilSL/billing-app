import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { usePermission } from '../../hooks/usePermission';

interface PermissionRouteProps {
  permission: string;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({ permission }) => {
  const hasPermission = usePermission(permission);
  return hasPermission ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};
