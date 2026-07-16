import React from 'react';
import { Menu } from 'lucide-react';
import { ProfileMenu } from './ProfileMenu';

export const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button - placeholder for future mobile sidebar toggle */}
        <button className="md:hidden p-2 text-muted-foreground hover:bg-secondary rounded-md">
          <Menu className="w-5 h-5" />
        </button>
        {/* Placeholder for Breadcrumbs */}
      </div>
      
      <div className="flex items-center gap-4">
        <ProfileMenu />
      </div>
    </header>
  );
};
