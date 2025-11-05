import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export const LessonCard = ({ id, title, description, image, category }: LessonCardProps) => {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(`lesson_${id}`);
    if (completed === "true") {
      setIsCompleted(true);
    }
  }, [id]);

  const toggleCompletion = () => {
    const newState = !isCompleted;
    setIsCompleted(newState);
    localStorage.setItem(`lesson_${id}`, String(newState));
    
    toast({
      title: newState ? "Lesson Completed! 🎉" : "Marked as incomplete",
      description: newState ? `Great job completing "${title}"!` : `"${title}" marked as incomplete`,
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg"
            onClick={toggleCompletion}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <span className="inline-block px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded-full">
            {category}
          </span>
        </div>
      </div>
      <CardContent className="p-5 space-y-3">
        <h3 className="text-xl font-bold text-foreground line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        <Button className="w-full" variant={isCompleted ? "outline" : "default"}>
          {isCompleted ? "Review Lesson" : "Start Learning"}
        </Button>
      </CardContent>
    </Card>
  );
};
