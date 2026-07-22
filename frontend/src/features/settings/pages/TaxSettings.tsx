import React from 'react';
import { GenericSettingsForm } from '../../../components/settings/GenericSettingsForm';

export const TaxSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Tax Configuration</h2>
        <p className="text-sm text-muted-foreground">Configure global tax settings.</p>
      </div>
      <GenericSettingsForm 
        title="Tax Rules"
        description="Configure default taxation rules."
        endpoint="tax"
        fields={[
          { name: 'defaultTaxId', label: 'Default Tax ID' },
          { name: 'taxInclusive', label: 'Prices include Tax', type: 'checkbox' },
        ]}
      />
    </div>
  );
};
