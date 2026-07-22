import React from 'react';
import { Link } from 'react-router-dom';

export const EmptySubscription: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Subscription</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Your tenant does not currently have an active subscription or plan assigned. Please contact the platform administrator to activate your account.
      </p>
      <Link
        to="/app/dashboard"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};
