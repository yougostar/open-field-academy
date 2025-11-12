import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Brain, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Quizzes = () => {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const groupedQuizzes = data?.reduce((acc: any, quiz: any) => {
        const existing = acc.find((q: any) => q.subject === quiz.subject);
        if (existing) {
          existing.questions.push(quiz);
        } else {
          acc.push({
            id: quiz.subject,
            subject: quiz.subject,
            questions: [quiz],
          });
        }
        return acc;
      }, []);

      setQuizzes(groupedQuizzes || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subjects = ["All", "Programming", "Algorithms", "Web Technology", "Cybersecurity"];
  const [activeSubject, setActiveSubject] = useState("All");

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = activeSubject === "All" || quiz.subject === activeSubject;
    return matchesSearch && matchesSubject;
  });

  const startQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = async () => {
    if (selectedAnswer === selectedQuiz.questions[currentQuestionIndex].correct_answer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz finished - save attempt
      const finalScore = selectedAnswer === selectedQuiz.questions[currentQuestionIndex].correct_answer 
        ? score + 1 
        : score;
      
      await saveQuizAttempt(finalScore);
      setShowResults(true);
    }
  };

  const saveQuizAttempt = async (finalScore: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const percentage = Math.round((finalScore / selectedQuiz.questions.length) * 100);
      
      // Save attempts for each question in the quiz
      for (const question of selectedQuiz.questions) {
        await supabase
          .from("quiz_attempts")
          .insert({
            user_id: user.id,
            quiz_id: question.id,
            score: percentage,
          });
      }

      toast({
        title: "Progress Saved!",
        description: `Your score of ${percentage}% has been recorded.`,
      });
    } catch (error: any) {
      console.error("Error saving quiz attempt:", error);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setShowResults(false);
  };

  if (selectedQuiz && !showResults) {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const options = [
      { key: "A", value: currentQuestion.option_a },
      { key: "B", value: currentQuestion.option_b },
      { key: "C", value: currentQuestion.option_c },
      { key: "D", value: currentQuestion.option_d },
    ];

    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:ml-64">
          <Topbar onSearch={() => {}} />
          <main className="p-4 md:p-6 space-y-6">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedQuiz.subject} Quiz</CardTitle>
                  <Badge variant="outline">
                    Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg font-medium">{currentQuestion.question}</div>
                <div className="space-y-3">
                  {options.map((option) => (
                    <Button
                      key={option.key}
                      variant={selectedAnswer === option.key ? "default" : "outline"}
                      className="w-full justify-start text-left h-auto py-4 px-6"
                      onClick={() => handleAnswerSelect(option.key)}
                    >
                      <span className="font-semibold mr-3">{option.key}.</span>
                      {option.value}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleBackToQuizzes} className="flex-1">
                    Back to Quizzes
                  </Button>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer}
                    className="flex-1"
                  >
                    {currentQuestionIndex < selectedQuiz.questions.length - 1
                      ? "Next Question"
                      : "Finish Quiz"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:ml-64">
          <Topbar onSearch={() => {}} />
          <main className="p-4 md:p-6 space-y-6">
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <CardTitle className="text-3xl">Quiz Complete! 🎉</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="text-6xl font-bold text-primary">{percentage}%</div>
                  <p className="text-muted-foreground">
                    You scored {score} out of {selectedQuiz.questions.length}
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={handleBackToQuizzes}>
                    Back to Quizzes
                  </Button>
                  <Button onClick={handleRetakeQuiz}>Retake Quiz</Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar onSearch={() => {}} />

        <main className="p-4 md:p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              Quizzes
            </h1>
            <p className="text-muted-foreground mt-1">
              Test your knowledge and track your progress
            </p>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <Badge
                key={subject}
                variant={activeSubject === subject ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveSubject(subject)}
              >
                {subject}
              </Badge>
            ))}
          </div>

          {loading ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Loading quizzes...</p>
            </Card>
          ) : filteredQuizzes.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No quizzes found</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="hover:shadow-elevated transition-all hover:-translate-y-1"
                >
                  <CardHeader>
                    <CardTitle>{quiz.subject}</CardTitle>
                    <Badge variant="secondary">{quiz.questions.length} Questions</Badge>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={() => startQuiz(quiz)}>
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Quizzes;
