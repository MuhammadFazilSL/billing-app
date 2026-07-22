import React from 'react';
import { GenericSettingsForm } from '../../../components/settings/GenericSettingsForm';

export const RegionalSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Regional Configuration</h2>
        <p className="text-sm text-muted-foreground">Configure timezone, currency, and language.</p>
      </div>
      <GenericSettingsForm 
        title="Localization"
        description="Set your local formats."
        endpoint="regional"
        fields={[
          { name: 'timezone', label: 'Timezone' },
          { name: 'language', label: 'Language' },
          { name: 'currency', label: 'Currency Code (e.g. USD, INR)' },
          { name: 'currencySymbol', label: 'Currency Symbol' },
          { name: 'dateFormat', label: 'Date Format' },
          { name: 'numberFormat', label: 'Number Format' },
        ]}
      />
    </div>
  );
};
