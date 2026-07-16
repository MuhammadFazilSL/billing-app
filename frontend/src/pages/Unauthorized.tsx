import React from 'react';
import { Link } from 'react-router-dom';

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="text-6xl font-bold text-destructive mb-4">401</h1>
      <h2 className="text-2xl font-semibold mb-2">Unauthorized Access</h2>
      <p className="text-muted-foreground mb-8">You do not have permission to view this page.</p>
      <Link 
        to="/app/dashboard" 
        className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};
