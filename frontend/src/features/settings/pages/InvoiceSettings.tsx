import React from 'react';
import { GenericSettingsForm } from '../../../components/settings/GenericSettingsForm';

export const InvoiceSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Invoice Configuration</h2>
        <p className="text-sm text-muted-foreground">Customize your invoice formats and prefixes.</p>
      </div>
      <GenericSettingsForm 
        title="Invoice Details"
        description="Set your invoice numbering and formatting."
        endpoint="invoice"
        fields={[
          { name: 'invoicePrefix', label: 'Invoice Prefix' },
          { name: 'invoiceSuffix', label: 'Invoice Suffix' },
          { name: 'nextInvoiceNumber', label: 'Next Invoice Number', type: 'number' },
          { name: 'receiptFooter', label: 'Receipt Footer' },
          { name: 'showLogo', label: 'Show Logo on Invoice', type: 'checkbox' },
          { name: 'showTax', label: 'Show Tax Breakup', type: 'checkbox' },
          { name: 'showBarcode', label: 'Show Barcode', type: 'checkbox' },
          { name: 'thermalReceiptWidth', label: 'Thermal Receipt Width' },
        ]}
      />
    </div>
  );
};
