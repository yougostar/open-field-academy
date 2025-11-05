import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

export const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-primary animate-pulse-soft">
      <div className="text-center space-y-4">
        <BookOpen className="h-16 w-16 text-white mx-auto animate-float" />
        <h1 className="text-3xl font-bold text-white">Aarambh</h1>
        <p className="text-white/80">Loading your learning journey...</p>
      </div>
    </div>
  );
};
