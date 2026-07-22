import React from 'react';
import { GenericSettingsForm } from '../../../components/settings/GenericSettingsForm';

export const PrinterSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Printer Configuration</h2>
        <p className="text-sm text-muted-foreground">Configure receipt printers and sizes.</p>
      </div>
      <GenericSettingsForm 
        title="Printer Details"
        description="Set your primary printing hardware."
        endpoint="printer"
        fields={[
          { name: 'printerType', label: 'Printer Type (e.g. Thermal, A4)' },
          { name: 'paperSize', label: 'Paper Size' },
          { name: 'copies', label: 'Default Copies', type: 'number' },
        ]}
      />
    </div>
  );
};
