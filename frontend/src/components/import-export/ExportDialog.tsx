import { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  moduleName: string;
}

export const ExportDialog = ({ isOpen, onClose, data, moduleName }: ExportDialogProps) => {
  const [format, setFormat] = useState<'csv' | 'excel'>('excel');

  if (!isOpen) return null;

  const handleExport = () => {
    if (data.length === 0) {
      alert('No data to export.');
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${moduleName}_Export_${timestamp}`;

    if (format === 'csv') {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `${fileName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, moduleName);
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#18181b] border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Export {moduleName}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-400 mb-6">
            Export {data.length} visible records. Choose your preferred file format below.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setFormat('excel')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                format === 'excel'
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <FileSpreadsheet className="w-8 h-8" />
              <span className="font-medium text-sm">Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => setFormat('csv')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                format === 'csv'
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <FileText className="w-8 h-8" />
              <span className="font-medium text-sm">CSV (.csv)</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-white/5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Now
          </button>
        </div>
      </div>
    </div>
  );
};
