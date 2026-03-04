import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NoteContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: {
    title: string;
    subject: string;
    class: string;
    content: string;
  } | null;
}

export const NoteContentDialog = ({ open, onOpenChange, note }: NoteContentDialogProps) => {
  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">{note.title}</DialogTitle>
          <div className="flex gap-2 pt-1">
            <Badge variant="secondary">{note.class}</Badge>
            <Badge variant="outline">{note.subject}</Badge>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 font-[system-ui]">
            {note.content}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
