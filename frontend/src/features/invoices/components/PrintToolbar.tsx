import React from 'react';
import { Printer, X } from 'lucide-react';

interface PrintToolbarProps {
  invoiceNumber: string;
  onPrintA4: () => void;
  onPrintThermal: () => void;
  onClose: () => void;
}

export const PrintToolbar: React.FC<PrintToolbarProps> = ({ invoiceNumber, onPrintA4, onPrintThermal, onClose }) => {
  return (
    <div className="flex flex-col border-b border-border bg-[#18181b] text-white">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="font-medium text-lg flex items-center gap-3">
          <div className="rounded-full bg-green-500/20 p-1 border border-green-500 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          Sale Complete — {invoiceNumber}
        </h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white rounded-md transition-colors"
          title="Close Preview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-end gap-3 p-4 bg-[#1e1e21]">
        <button
          onClick={onPrintThermal}
          className="flex items-center gap-2 px-4 py-2 bg-transparent text-gray-300 border border-gray-600 rounded-md font-medium hover:bg-white/5 transition-colors text-sm shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Print Thermal
        </button>
        <button
          onClick={onPrintA4}
          className="flex items-center gap-2 px-6 py-2 bg-[#4338ca] text-white rounded-md font-medium hover:bg-[#4f46e5] transition-colors text-sm shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Print Invoice
        </button>
      </div>
    </div>
  );
};
