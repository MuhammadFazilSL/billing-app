import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';

interface ExportButtonsProps {
  onExportCsv?: () => void;
  onExportExcel?: () => void;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ onExportCsv, onExportExcel }) => {
  return (
    <div className="flex gap-2">
      <button 
        onClick={onExportCsv}
        className="flex items-center gap-2 h-10 px-4 rounded-md border bg-background hover:bg-muted text-sm font-medium"
      >
        <Download className="h-4 w-4" /> CSV
      </button>
      <button 
        onClick={onExportExcel}
        className="flex items-center gap-2 h-10 px-4 rounded-md border bg-background hover:bg-muted text-sm font-medium"
      >
        <FileSpreadsheet className="h-4 w-4" /> Excel
      </button>
    </div>
  );
};
