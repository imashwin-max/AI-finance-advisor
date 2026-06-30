import { useState, useRef, type DragEvent } from "react";
import { UploadCloud, FileSpreadsheet, Download } from "lucide-react";
import { motion } from "framer-motion";
import { transactionService } from "@/services/transactionService";
import { useToast } from "@/components/ui/Toast";

export function Dropzone({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      showToast("Please upload a .csv file.", "error");
      return;
    }
    setProgress(0);
    try {
      const result = await transactionService.uploadCsv(file, setProgress);
      showToast(`Imported ${result.transactions_imported} transactions.`, "success");
      onUploadComplete();
    } catch {
      showToast("Upload failed. Please check the file format and try again.", "error");
    } finally {
      setProgress(null);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-border bg-surface/50 hover:border-primary/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }}
      />

      {progress !== null ? (
        <>
          <FileSpreadsheet className="h-10 w-10 text-primary animate-pulse" />
          <div className="w-full max-w-xs">
            <div className="h-2 w-full rounded-full bg-surfaceHover overflow-hidden">
              <div className="h-full bg-gradient-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="mt-2 block text-xs text-muted">Uploading… {progress}%</span>
          </div>
        </>
      ) : (
        <>
          <UploadCloud className="h-10 w-10 text-primary" />
          <div>
            <p className="font-medium text-white">Drag & drop your bank statement CSV</p>
            <p className="text-sm text-muted">or click to browse files</p>
          </div>
        </>
      )}

      <a
        href={transactionService.sampleCsvUrl()}
        onClick={(e) => e.stopPropagation()}
        className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:underline"
      >
        <Download className="h-3.5 w-3.5" /> Download sample CSV
      </a>
    </motion.div>
  );
}
