import React, { useState, useRef } from 'react';
import { parseSpecSheetFile, type SpecImportResult } from '@/lib/specParser';

export type DetailedSpec = { label: string; value: string; method: string };
export type KeySpec = { label: string; value: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onApplySpecs: (
    detailedSpecs: DetailedSpec[],
    keySpecs: KeySpec[],
    metadata?: { title?: string; description?: string }
  ) => void;
  commodityName?: string;
  existingDetailedSpecs?: DetailedSpec[];
};

export default function SpecImportModal({
  isOpen,
  onClose,
  onApplySpecs,
  commodityName,
  existingDetailedSpecs = [],
}: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState<SpecImportResult | null>(null);
  const [editedRows, setEditedRows] = useState<DetailedSpec[]>([]);
  const [mergeMode, setMergeMode] = useState<'replace' | 'append'>('replace');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setLoading(true);
    setError('');
    setParsedData(null);
    try {
      const result = await parseSpecSheetFile(file);
      
      const rows: DetailedSpec[] = [];

      if (result.specDetails && result.specDetails.length > 0) {
        result.specDetails.forEach((d) => {
          rows.push({
            label: d.property,
            value: d.value,
            method: d.testMethod || '',
          });
        });
      } else if (result.specs && Object.keys(result.specs).length > 0) {
        Object.entries(result.specs).forEach(([k, v]) => {
          rows.push({
            label: k,
            value: v,
            method: '',
          });
        });
      }

      if (rows.length === 0) {
        throw new Error('No specification key-value pairs or tables were detected in this document.');
      }

      setParsedData(result);
      setEditedRows(rows);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleRowChange = (index: number, field: keyof DetailedSpec, newVal: string) => {
    setEditedRows((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: newVal } : item)));
  };

  const handleRemoveRow = (index: number) => {
    setEditedRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddRow = () => {
    setEditedRows((prev) => [...prev, { label: '', value: '', method: '' }]);
  };

  const handleConfirmImport = () => {
    const validRows = editedRows.filter((r) => r.label.trim() && r.value.trim());

    let finalDetailedSpecs: DetailedSpec[] = [];
    if (mergeMode === 'append') {
      finalDetailedSpecs = [...existingDetailedSpecs, ...validRows];
    } else {
      finalDetailedSpecs = validRows;
    }

    // Auto-generate key specs from top 4 primary specifications
    const keySpecs: KeySpec[] = validRows.slice(0, 4).map((r) => ({
      label: r.label,
      value: r.value,
    }));

    onApplySpecs(finalDetailedSpecs, keySpecs, {
      title: parsedData?.extractedTitle,
    });
    onClose();
  };

  const sampleCsvContent = `Property,Typical Value,Test Method
Fe (Total),64.5% Min,ISO 2597-1
SiO2,3.2% Max,ISO 2598-1
Al2O3,2.1% Max,ISO 2598-1
Phosphorus (P),0.05% Max,ISO 2599
Sulfur (S),0.03% Max,ISO 4689-2
Moisture,8.0% Max,ISO 3087`;

  const handleDownloadSampleCsv = () => {
    const blob = new Blob([sampleCsvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_commodity_spec_sheet.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-background-50 rounded-xl max-w-3xl w-full p-6 shadow-2xl border border-background-200 my-6 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-background-200 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-accent-100 flex items-center justify-center text-accent-700 text-xl font-bold">
              <i className="ri-file-excel-2-line"></i>
            </span>
            <div>
              <h3 className="text-base font-bold text-foreground-950 font-heading">
                Import Spec Sheet (Word / CSV)
              </h3>
              <p className="text-xs text-foreground-500">
                {commodityName
                  ? `Importing technical specifications for ${commodityName}`
                  : 'Auto-extract specification tables from Word documents (.docx) or CSV spreadsheets'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md text-foreground-400 hover:text-foreground-700 hover:bg-background-200 flex items-center justify-center cursor-pointer transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 space-y-4 pr-1">
          {/* Dropzone */}
          {!parsedData && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3.5 ${
                dragActive
                  ? 'border-primary-500 bg-primary-50/60'
                  : 'border-background-300 hover:border-primary-400 hover:bg-background-100/60 bg-background-100/30'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
                accept=".docx,.csv,.tsv,.txt"
                className="hidden"
              />

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl shadow-sm">
                  <i className="ri-file-word-2-line"></i>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl shadow-sm">
                  <i className="ri-file-excel-line"></i>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-foreground-900">
                  Click to select file or drag & drop spec sheet here
                </p>
                <p className="text-xs text-foreground-500 mt-1">
                  Supports Microsoft Word (<strong className="font-semibold text-foreground-700">.docx</strong>), Excel CSV (<strong className="font-semibold text-foreground-700">.csv</strong>), or TSV files
                </p>
              </div>

              {loading && (
                <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 bg-background-50 px-3.5 py-1.5 rounded-full border border-primary-200 shadow-sm">
                  <i className="ri-loader-4-line animate-spin text-sm"></i> Extracting specification parameters...
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg text-xs flex items-center gap-2">
              <i className="ri-error-warning-line text-base shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedData && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-lg p-3">
                <div className="flex items-center gap-2.5">
                  <i className="ri-checkbox-circle-fill text-primary-600 text-lg"></i>
                  <div>
                    <span className="text-xs font-bold text-primary-900">
                      Successfully Extracted {editedRows.length} Technical Specifications
                    </span>
                    {parsedData.extractedTitle && (
                      <p className="text-[11px] text-primary-700">
                        Detected Title: <em>"{parsedData.extractedTitle}"</em>
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setParsedData(null);
                    setEditedRows([]);
                  }}
                  className="text-xs text-primary-700 hover:text-primary-900 underline font-medium cursor-pointer"
                >
                  Upload Different File
                </button>
              </div>

              {/* Mode selection */}
              <div className="flex items-center gap-4 text-xs text-foreground-700 bg-background-100 p-2.5 rounded-lg">
                <span className="font-semibold text-foreground-900">Apply Mode:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="mergeMode"
                    value="replace"
                    checked={mergeMode === 'replace'}
                    onChange={() => setMergeMode('replace')}
                    className="accent-primary-600"
                  />
                  <span>Replace existing specifications</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="mergeMode"
                    value="append"
                    checked={mergeMode === 'append'}
                    onChange={() => setMergeMode('append')}
                    className="accent-primary-600"
                  />
                  <span>Append to existing specs</span>
                </label>
              </div>

              {/* Editable Spec Grid */}
              <div className="border border-background-200 rounded-lg overflow-hidden">
                <div className="bg-background-200/70 px-3 py-2 text-[11px] font-bold text-foreground-700 grid grid-cols-12 gap-2 uppercase tracking-wider">
                  <div className="col-span-4">Property / Parameter</div>
                  <div className="col-span-4">Typical Value / Assay</div>
                  <div className="col-span-3">Test Method / Standard</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>

                <div className="divide-y divide-background-200 max-h-[280px] overflow-y-auto">
                  {editedRows.map((row, index) => (
                    <div
                      key={index}
                      className="p-2 grid grid-cols-12 gap-2 items-center bg-background-50 hover:bg-background-100/60 transition-colors"
                    >
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={row.label}
                          onChange={(e) => handleRowChange(index, 'label', e.target.value)}
                          placeholder="e.g. Fe Content"
                          className="w-full bg-background-100 border border-background-300 rounded px-2.5 py-1.5 text-xs text-foreground-900 font-bold focus:outline-none focus:border-primary-500"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={row.value}
                          onChange={(e) => handleRowChange(index, 'value', e.target.value)}
                          placeholder="e.g. 64.5% Min"
                          className="w-full bg-background-100 border border-background-300 rounded px-2.5 py-1.5 text-xs text-foreground-900 font-mono focus:outline-none focus:border-primary-500"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={row.method}
                          onChange={(e) => handleRowChange(index, 'method', e.target.value)}
                          placeholder="e.g. ISO 2597-1"
                          className="w-full bg-background-100 border border-background-300 rounded px-2.5 py-1.5 text-xs text-foreground-600 focus:outline-none focus:border-primary-500"
                        />
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          className="w-7 h-7 rounded text-foreground-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center text-sm transition-colors cursor-pointer"
                          title="Remove row"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-background-100 border-t border-background-200 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <i className="ri-add-line"></i> Add Spec Row
                  </button>
                  <span className="text-[11px] text-foreground-500 font-medium">
                    {editedRows.length} parameters ready
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Sample template help */}
          {!parsedData && (
            <div className="bg-background-100/80 rounded-lg p-3.5 border border-background-200 text-xs text-foreground-600 flex items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-foreground-800">Need a sample template?</span>
                <p className="text-[11px] text-foreground-500 mt-0.5">
                  Download a sample 3-column CSV spreadsheet formatted with properties, assays, and ISO standards.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="bg-background-50 hover:bg-background-200 border border-background-300 text-foreground-800 text-xs font-medium px-3 py-1.5 rounded flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <i className="ri-download-line text-accent-700 font-bold"></i> Sample CSV
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-background-200 mt-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-background-200 hover:bg-background-300 text-xs font-medium text-foreground-700 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!parsedData || editedRows.length === 0}
            onClick={handleConfirmImport}
            className="px-5 py-2 rounded-md bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-background-50 flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
          >
            <i className="ri-check-double-line"></i> Apply Specifications to Commodity
          </button>
        </div>
      </div>
    </div>
  );
}
