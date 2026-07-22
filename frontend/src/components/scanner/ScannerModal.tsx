import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { BarcodeScanner } from './BarcodeScanner';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductFound: (product: any) => void;
  products: any[];
}

export const ScannerModal = ({ isOpen, onClose, onProductFound, products }: ScannerModalProps) => {
  const [manualCode, setManualCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setManualCode('');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (code: string) => {
    setErrorMsg('');
    if (!code) return;

    // Search order: Barcode -> SKU -> QR Code (using barcode field as generic fallback if QR isn't separated)
    const foundProduct = products.find(
      (p) =>
        (p.barcode && p.barcode.toLowerCase() === code.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase() === code.toLowerCase())
    );

    if (foundProduct) {
      onProductFound(foundProduct);
      onClose();
    } else {
      setErrorMsg('Product not found');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#18181b] border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Scan Barcode / QR</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-400 mb-4 text-center">
            Position the barcode or QR code inside the camera frame.
          </p>

          <BarcodeScanner
            onScan={(text) => handleSearch(text)}
            onError={() => {}} // Ignore noisy read errors
          />

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-xs text-gray-500 uppercase font-medium">Or enter manually</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <div className="mt-6 relative">
            <input
              type="text"
              placeholder="Enter Barcode or SKU..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(manualCode)}
              className="w-full bg-black/20 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleSearch(manualCode)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <p className="mt-3 text-sm text-red-400 text-center font-medium animate-pulse">
              {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
