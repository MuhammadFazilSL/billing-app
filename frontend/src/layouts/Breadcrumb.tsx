import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center text-sm text-muted-foreground">
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name = value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <div key={to} className="flex items-center">
            {isLast ? (
              <span className="font-medium text-foreground">{name}</span>
            ) : (
              <>
                <Link to={to} className="hover:text-foreground transition-colors">
                  {name}
                </Link>
                <ChevronRight className="w-4 h-4 mx-1" />
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
};
