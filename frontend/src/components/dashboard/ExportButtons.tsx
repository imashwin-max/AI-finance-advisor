import { useState } from "react";
import { FileDown, FileText, Loader2 } from "lucide-react";
import { exportService } from "@/services/exportService";
import { useToast } from "@/components/ui/Toast";

export function ExportButtons() {
  const [loadingType, setLoadingType] = useState<"csv" | "pdf" | null>(null);
  const { showToast } = useToast();

  const handleExport = async (type: "csv" | "pdf") => {
    setLoadingType(type);
    try {
      if (type === "csv") await exportService.downloadCsv();
      else await exportService.downloadPdf();
      showToast(`${type.toUpperCase()} report downloaded.`, "success");
    } catch {
      showToast(`Failed to export ${type.toUpperCase()} report.`, "error");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport("csv")}
        disabled={loadingType !== null}
        className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-white/80 hover:border-primary/50 hover:text-white transition-colors disabled:opacity-50"
      >
        {loadingType === "csv" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
        Export CSV
      </button>
      <button
        onClick={() => handleExport("pdf")}
        disabled={loadingType !== null}
        className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-white/80 hover:border-primary/50 hover:text-white transition-colors disabled:opacity-50"
      >
        {loadingType === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
        Export PDF
      </button>
    </div>
  );
}
