import React from 'react';

interface InvoiceFooterProps {
  user: any;
  companyProfile: any;
}

export const InvoiceFooter: React.FC<InvoiceFooterProps> = ({ user, companyProfile }) => {
  const authorizer = companyProfile?.legalName || companyProfile?.companyName || 'Authorised Signatory';
  const cashierName = user ? `${user.firstName} ${user.lastName}` : 'Cashier';

  return (
    <div className="mt-8 pt-4 border-t border-gray-200 text-sm">
      <div className="flex justify-between items-end mb-4">
        <div className="text-gray-500 text-xs">
          <p>Payment Mode: <span className="font-semibold text-black">Cash</span></p>
          <p className="mt-2">This is a computer generated invoice and does not require a physical signature.</p>
        </div>
        <div className="text-center w-48">
          <div className="border-t border-black pt-1 mt-8 text-xs font-semibold text-black">
            Authorised Signatory
            <div className="text-gray-500 font-normal">{authorizer}</div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-400 mt-6 pb-2">
        <p>Thank you for your purchase! Visit us again.</p>
        <p>Billed by: {cashierName}</p>
      </div>
    </div>
  );
};
