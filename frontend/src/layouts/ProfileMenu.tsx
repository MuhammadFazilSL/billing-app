import React, { useState } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';

export const ProfileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      dispatch(logout());
      navigate('/auth/login');
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary transition-colors focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <UserIcon className="w-4 h-4 text-primary" />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-50 py-1">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
};
