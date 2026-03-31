import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { BookOpen, Lightbulb, Star, Pencil } from "lucide-react";

export interface LessonTopic {
  title: string;
  explanation: string;
  example?: string;
  funFact?: string;
  activity?: string;
}

export interface LessonDetail {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  classLevel: string;
  duration: string;
  topics: LessonTopic[];
}

interface LessonDetailDialogProps {
  lesson: LessonDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LessonDetailDialog = ({ lesson, open, onOpenChange }: LessonDetailDialogProps) => {
  if (!lesson) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary">{lesson.category}</Badge>
            <Badge variant="outline">{lesson.classLevel}</Badge>
            <Badge variant="outline">⏱ {lesson.duration}</Badge>
          </div>
          <DialogTitle className="text-2xl">{lesson.title}</DialogTitle>
          <DialogDescription>{lesson.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[55vh] pr-4">
          <Accordion type="single" collapsible className="w-full">
            {lesson.topics.map((topic, i) => (
              <AccordionItem key={i} value={`topic-${i}`}>
                <AccordionTrigger className="text-left">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary shrink-0" />
                    <span>Topic {i + 1}: {topic.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-2">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                        {topic.explanation}
                      </p>
                    </div>

                    {topic.example && (
                      <div className="flex gap-2 bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <Pencil className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-primary mb-1">Example</p>
                          <p className="text-sm text-foreground">{topic.example}</p>
                        </div>
                      </div>
                    )}

                    {topic.funFact && (
                      <div className="flex gap-2 bg-accent/30 border border-accent/40 rounded-lg p-3">
                        <Star className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-accent-foreground mb-1">Fun Fact!</p>
                          <p className="text-sm text-foreground">{topic.funFact}</p>
                        </div>
                      </div>
                    )}

                    {topic.activity && (
                      <div className="flex gap-2 bg-secondary/30 border border-secondary/40 rounded-lg p-3">
                        <Lightbulb className="h-4 w-4 text-secondary-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-secondary-foreground mb-1">Try This! 🎯</p>
                          <p className="text-sm text-foreground">{topic.activity}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
