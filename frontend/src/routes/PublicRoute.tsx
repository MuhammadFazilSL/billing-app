import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Loading } from '../components/ui/Loading';

export const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <Outlet />;
};
