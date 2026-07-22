import { CheckCircle } from 'lucide-react';

interface ImportSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
  total: number;
  imported: number;
  failed: number;
}

export const ImportSummary = ({ isOpen, onClose, moduleName, total, imported, failed }: ImportSummaryProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#18181b] border border-white/10 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Import Complete</h2>
          <p className="text-gray-400 text-sm mb-6">
            The {moduleName} import process has finished.
          </p>

          <div className="space-y-3 bg-white/5 p-4 rounded-xl text-left">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total Records</span>
              <span className="font-semibold text-white">{total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-400 text-sm">Successfully Imported</span>
              <span className="font-semibold text-emerald-400">{imported}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-400 text-sm">Failed to Import</span>
              <span className="font-semibold text-red-400">{failed}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-white/5">
          <button
            onClick={onClose}
            className="w-full py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
