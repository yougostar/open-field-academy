import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface QuizTimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export const QuizTimer = ({ totalSeconds, onTimeUp, isActive }: QuizTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  useEffect(() => {
    setTimeLeft(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / totalSeconds) * 100;
  const isLow = timeLeft <= 10;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
      isLow ? "border-destructive bg-destructive/10 animate-pulse" : "border-primary/30 bg-primary/5"
    }`}>
      <Clock className={`h-4 w-4 ${isLow ? "text-destructive" : "text-primary"}`} />
      <span className={`font-mono font-bold text-sm ${isLow ? "text-destructive" : "text-foreground"}`}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isLow ? "bg-destructive" : "bg-primary"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
