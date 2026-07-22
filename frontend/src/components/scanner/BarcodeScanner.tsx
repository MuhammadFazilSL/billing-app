import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onError?: (errorMessage: string) => void;
}

export const BarcodeScanner = ({ onScan, onError }: BarcodeScannerProps) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Create the scanner only once
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      rememberLastUsedCamera: true,
    };

    scannerRef.current = new Html5QrcodeScanner('reader', config, false);

    scannerRef.current.render(
      (text) => {
        // Pause scanner after successful scan
        if (scannerRef.current) {
          scannerRef.current.pause();
        }
        onScan(text);
      },
      (error) => {
        if (onError) onError(error);
      }
    );

    return () => {
      // Cleanup on unmount
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => {
          console.error('Failed to clear scanner on unmount', err);
        });
      }
    };
  }, [onScan, onError]);

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-xl border border-white/10 bg-black/50">
      <div id="reader" className="w-full"></div>
    </div>
  );
};
