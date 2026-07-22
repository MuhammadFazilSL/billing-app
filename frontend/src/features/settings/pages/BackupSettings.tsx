import React from 'react';
import { GenericSettingsForm } from '../../../components/settings/GenericSettingsForm';

export const BackupSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Backup Configuration</h2>
        <p className="text-sm text-muted-foreground">Manage your automated backups.</p>
      </div>
      <GenericSettingsForm 
        title="Automated Backups"
        description="Configure your backup policy."
        endpoint="backup"
        fields={[
          { name: 'autoBackup', label: 'Enable Auto Backup', type: 'checkbox' },
          { name: 'backupFrequency', label: 'Backup Frequency (Daily, Weekly)' },
        ]}
      />
    </div>
  );
};
