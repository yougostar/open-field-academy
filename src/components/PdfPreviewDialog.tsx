import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

interface PdfPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileUrl: string;
  title: string;
}

export const PdfPreviewDialog = ({ open, onOpenChange, fileUrl, title }: PdfPreviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-8">
            <span className="truncate">{title}</span>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={() => window.open(fileUrl, "_blank")}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Open
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                const a = document.createElement("a");
                a.href = fileUrl;
                a.download = `${title}.pdf`;
                a.click();
              }}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 rounded-lg overflow-hidden border bg-muted">
          <iframe
            src={`${fileUrl}#toolbar=1`}
            className="w-full h-full"
            title={title}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
