import { useState } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { ImportSummary } from './ImportSummary';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
  onImport: (data: any[]) => Promise<void>;
  expectedColumns: string[];
}

export const ImportDialog = ({ isOpen, onClose, moduleName, onImport, expectedColumns }: ImportDialogProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState({ total: 0, imported: 0, failed: 0 });

  if (!isOpen) return null;

  const resetState = () => {
    setFile(null);
    setPreview([]);
    setErrors([]);
    setShowSummary(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) processFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFile(file);
    setErrors([]);
    setPreview([]);

    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (fileExt === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          validateAndSetData(results.data as any[]);
        },
        error: (err) => setErrors([err.message]),
      });
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          validateAndSetData(json);
        } catch (err) {
          setErrors(['Failed to parse Excel file.']);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      setErrors(['Unsupported file format. Please upload CSV or Excel.']);
    }
  };

  const validateAndSetData = (data: any[]) => {
    if (data.length === 0) {
      setErrors(['File is empty.']);
      return;
    }

    const fileColumns = Object.keys(data[0] || {});
    const missingColumns = expectedColumns.filter((col) => !fileColumns.includes(col));

    if (missingColumns.length > 0) {
      setErrors([`Missing required columns: ${missingColumns.join(', ')}`]);
      return;
    }

    setPreview(data);
  };

  const handleImport = async () => {
    if (preview.length === 0) return;
    setIsProcessing(true);
    try {
      await onImport(preview);
      setSummaryData({ total: preview.length, imported: preview.length, failed: 0 });
      setShowSummary(true);
    } catch (error: any) {
      setErrors([error.message || 'Import failed during processing.']);
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSummary) {
    return (
      <ImportSummary
        isOpen={true}
        onClose={handleClose}
        moduleName={moduleName}
        total={summaryData.total}
        imported={summaryData.imported}
        failed={summaryData.failed}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#18181b] border border-white/10 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <h2 className="text-lg font-semibold text-white">Import {moduleName}</h2>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Drag and drop file here</h3>
              <p className="text-gray-400 text-sm mb-6">Support CSV, XLS, XLSX formats</p>
              
              <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg cursor-pointer transition-colors">
                Browse Files
                <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-indigo-400" />
                  <div>
                    <h4 className="text-sm font-medium text-white">{file.name}</h4>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="text-xs text-red-400 hover:text-red-300">
                  Remove
                </button>
              </div>

              {errors.length > 0 && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <h4 className="font-medium">Validation Errors</h4>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-red-400/80 space-y-1">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {preview.length > 0 && (
                <div className="border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                    <h4 className="text-sm font-medium text-white">Preview (First 5 Rows)</h4>
                    <span className="text-xs text-gray-400">Total Valid Rows: {preview.length}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-white/5 text-gray-400">
                        <tr>
                          {Object.keys(preview[0]).map((key) => (
                            <th key={key} className="px-4 py-2 font-medium">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {preview.slice(0, 5).map((row, i) => (
                          <tr key={i} className="hover:bg-white/5">
                            {Object.values(row).map((val: any, j) => (
                              <td key={j} className="px-4 py-2 text-gray-300">
                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-white/5 shrink-0">
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={preview.length === 0 || errors.length > 0 || isProcessing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Importing...' : `Import ${preview.length} Records`}
          </button>
        </div>
      </div>
    </div>
  );
};
