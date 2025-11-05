import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Trophy, Target, Play, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Quiz {
  id: string;
  title: string;
  category: string;
  questions: number;
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard";
  completed: boolean;
  score?: number;
}

const Quizzes = () => {
  const [quizzes] = useState<Quiz[]>([
    {
      id: "1",
      title: "Basic Algebra",
      category: "Math",
      questions: 10,
      duration: 15,
      difficulty: "Easy",
      completed: true,
      score: 85,
    },
    {
      id: "2",
      title: "Physics Fundamentals",
      category: "Science",
      questions: 15,
      duration: 20,
      difficulty: "Medium",
      completed: false,
    },
    {
      id: "3",
      title: "Grammar Advanced",
      category: "English",
      questions: 12,
      duration: 18,
      difficulty: "Hard",
      completed: true,
      score: 92,
    },
  ]);

  const [timedMode, setTimedMode] = useState(true);
  const [showHints, setShowHints] = useState(true);
  const [randomOrder, setRandomOrder] = useState(false);

  const startQuiz = (quiz: Quiz) => {
    toast({
      title: "Quiz Starting! 🎯",
      description: `Get ready for ${quiz.title}`,
    });
  };

  const completedQuizzes = quizzes.filter((q) => q.completed).length;
  const averageScore =
    quizzes.filter((q) => q.score).reduce((acc, q) => acc + (q.score || 0), 0) /
    quizzes.filter((q) => q.score).length;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar onSearch={() => {}} />
        
        <main className="p-4 md:p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              Quizzes
            </h1>
            <p className="text-muted-foreground mt-1">
              Test your knowledge and track your progress
            </p>
          </div>

          {/* Quiz Settings */}
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quiz Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <Label htmlFor="timed-mode" className="cursor-pointer">
                    Timed Mode
                  </Label>
                  <Switch
                    id="timed-mode"
                    checked={timedMode}
                    onCheckedChange={setTimedMode}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <Label htmlFor="show-hints" className="cursor-pointer">
                    Show Hints
                  </Label>
                  <Switch
                    id="show-hints"
                    checked={showHints}
                    onCheckedChange={setShowHints}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <Label htmlFor="random-order" className="cursor-pointer">
                    Random Order
                  </Label>
                  <Switch
                    id="random-order"
                    checked={randomOrder}
                    onCheckedChange={setRandomOrder}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{quizzes.length}</div>
                    <div className="text-xs text-muted-foreground">Total Quizzes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">{completedQuizzes}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-warning">
                      {averageScore.toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-info">
                      {quizzes.length - completedQuizzes}
                    </div>
                    <div className="text-xs text-muted-foreground">Remaining</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quizzes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className="hover:shadow-elevated transition-all hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    {quiz.completed && (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{quiz.category}</Badge>
                    <Badge
                      variant={
                        quiz.difficulty === "Easy"
                          ? "default"
                          : quiz.difficulty === "Medium"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {quiz.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target className="h-4 w-4" />
                      {quiz.questions} Questions
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {quiz.duration} Minutes
                    </div>
                  </div>

                  {quiz.completed && quiz.score !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Your Score</span>
                        <span className="font-semibold text-foreground">{quiz.score}%</span>
                      </div>
                      <Progress value={quiz.score} className="h-2" />
                    </div>
                  )}

                  <Button
                    className="w-full gap-2"
                    onClick={() => startQuiz(quiz)}
                    variant={quiz.completed ? "outline" : "default"}
                  >
                    {quiz.completed ? (
                      <>
                        <Trophy className="h-4 w-4" />
                        Retake Quiz
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Start Quiz
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Quizzes;
