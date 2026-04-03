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
      <DialogContent className="max-w-4xl w-[95vw] h-[95vh] max-h-[95vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary">{lesson.category}</Badge>
            <Badge variant="outline">{lesson.classLevel}</Badge>
            <Badge variant="outline">⏱ {lesson.duration}</Badge>
            <Badge variant="outline">📚 {lesson.topics.length} Topics</Badge>
          </div>
          <DialogTitle className="text-2xl md:text-3xl">{lesson.title}</DialogTitle>
          <DialogDescription className="text-base">{lesson.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 mt-2">
          <Accordion type="single" collapsible className="w-full">
            {lesson.topics.map((topic, i) => (
              <AccordionItem key={i} value={`topic-${i}`}>
                <AccordionTrigger className="text-left text-base md:text-lg py-4">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary shrink-0" />
                    <span>Topic {i + 1}: {topic.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-5 pl-2 pb-4">
                    <div className="bg-muted/50 rounded-lg p-5 md:p-6">
                      <p className="text-sm md:text-base leading-relaxed text-foreground whitespace-pre-line">
                        {topic.explanation}
                      </p>
                    </div>

                    {topic.example && (
                      <div className="flex gap-3 bg-primary/5 border border-primary/20 rounded-lg p-4 md:p-5">
                        <Pencil className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs md:text-sm font-semibold text-primary mb-1">Example</p>
                          <p className="text-sm md:text-base text-foreground whitespace-pre-line">{topic.example}</p>
                        </div>
                      </div>
                    )}

                    {topic.funFact && (
                      <div className="flex gap-3 bg-accent/30 border border-accent/40 rounded-lg p-4 md:p-5">
                        <Star className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs md:text-sm font-semibold text-accent-foreground mb-1">Fun Fact!</p>
                          <p className="text-sm md:text-base text-foreground whitespace-pre-line">{topic.funFact}</p>
                        </div>
                      </div>
                    )}

                    {topic.activity && (
                      <div className="flex gap-3 bg-secondary/30 border border-secondary/40 rounded-lg p-4 md:p-5">
                        <Lightbulb className="h-5 w-5 text-secondary-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs md:text-sm font-semibold text-secondary-foreground mb-1">Try This! 🎯</p>
                          <p className="text-sm md:text-base text-foreground whitespace-pre-line">{topic.activity}</p>
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
