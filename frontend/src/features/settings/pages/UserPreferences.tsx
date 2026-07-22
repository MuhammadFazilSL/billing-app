import React from 'react';
import { GenericSettingsForm } from '../../../components/settings/GenericSettingsForm';

export const UserPreferences: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">User Preferences</h2>
        <p className="text-sm text-muted-foreground">Customize your personal UI experience.</p>
      </div>
      <GenericSettingsForm 
        title="UI Preferences"
        description="Set your dashboard layout and theme."
        endpoint="preferences"
        fields={[
          { name: 'darkMode', label: 'Enable Dark Mode', type: 'checkbox' },
          { name: 'compactSidebar', label: 'Compact Sidebar', type: 'checkbox' },
          { name: 'dashboardLayout', label: 'Dashboard Layout Type' },
        ]}
      />
    </div>
  );
};
