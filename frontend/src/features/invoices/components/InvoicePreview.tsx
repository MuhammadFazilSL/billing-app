import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PrintToolbar } from './PrintToolbar';
import { GSTInvoiceA4 } from './GSTInvoiceA4';
import { ThermalReceipt } from './ThermalReceipt';

interface InvoicePreviewProps {
  invoice: any;
  onClose: () => void;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, onClose }) => {
  const a4Ref = useRef<HTMLDivElement>(null);
  const thermalRef = useRef<HTMLDivElement>(null);

  const handlePrintA4 = useReactToPrint({
    content: () => a4Ref.current,
    documentTitle: `Invoice_${invoice?.invoiceNumber}_A4`,
  });

  const handlePrintThermal = useReactToPrint({
    content: () => thermalRef.current,
    documentTitle: `Invoice_${invoice?.invoiceNumber}_Thermal`,
  });

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm overflow-hidden p-4 md:p-12">
      <div className="w-full max-w-4xl mx-auto bg-[#18181b] shadow-2xl rounded-xl flex flex-col overflow-hidden border border-white/10 max-h-full">
        {/* Toolbar */}
        <PrintToolbar 
          invoiceNumber={invoice.invoiceNumber}
          onPrintA4={handlePrintA4}
          onPrintThermal={handlePrintThermal}
          onClose={onClose}
        />
        
        {/* Preview Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20 relative">
          
          {/* A4 Preview - Visible to user */}
          <div className="flex justify-center">
            {/* The scale creates a nice zoomed-out effect for the preview on smaller screens, while preserving print size */}
            <div className="shadow-lg transform origin-top w-max bg-white transition-all">
              <GSTInvoiceA4 ref={a4Ref} invoice={invoice} />
            </div>
          </div>
          
          {/* Thermal Preview - Hidden from screen, only used for printing */}
          <div className="absolute left-0 top-0 -z-50 opacity-0 pointer-events-none">
            <ThermalReceipt ref={thermalRef} invoice={invoice} />
          </div>

        </div>
      </div>
    </div>
  );
};
