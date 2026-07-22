import React from 'react';
import { GenericSettingsForm } from '../../../components/settings/GenericSettingsForm';

export const EmailSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Email Configuration</h2>
        <p className="text-sm text-muted-foreground">Configure SMTP and automated emails.</p>
      </div>
      <GenericSettingsForm 
        title="SMTP Settings"
        description="Configure how outbound emails are sent."
        endpoint="email"
        fields={[
          { name: 'smtpHost', label: 'SMTP Host' },
          { name: 'smtpPort', label: 'SMTP Port', type: 'number' },
          { name: 'smtpUsername', label: 'SMTP Username' },
          { name: 'smtpPassword', label: 'SMTP Password', type: 'text' },
          { name: 'senderName', label: 'Sender Name' },
          { name: 'senderEmail', label: 'Sender Email', type: 'email' },
        ]}
      />
    </div>
  );
};
