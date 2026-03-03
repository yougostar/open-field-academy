import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { QuizTimer } from "@/components/QuizTimer";
import { Brain, Search, CheckCircle, XCircle } from "lucide-react";
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
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => { fetchQuizzes(); }, []);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      const grouped = data?.reduce((acc: any, quiz: any) => {
        const existing = acc.find((q: any) => q.subject === quiz.subject);
        if (existing) existing.questions.push(quiz);
        else acc.push({ id: quiz.subject, subject: quiz.subject, questions: [quiz] });
        return acc;
      }, []);
      setQuizzes(grouped || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setLoading(false); }
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
    setShowFeedback(false);
    setTimerActive(true);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    const correct = selectedAnswer === selectedQuiz.questions[currentQuestionIndex].correct_answer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
    setShowFeedback(true);
    setTimerActive(false);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimerActive(true);
    } else {
      saveQuizAttempt(score);
      setShowResults(true);
    }
  };

  const handleTimeUp = useCallback(() => {
    setShowFeedback(true);
    setIsCorrect(false);
    setTimerActive(false);
  }, []);

  const saveQuizAttempt = async (finalScore: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const percentage = Math.round((finalScore / selectedQuiz.questions.length) * 100);
      for (const question of selectedQuiz.questions) {
        await supabase.from("quiz_attempts").insert({ user_id: user.id, quiz_id: question.id, score: percentage });
      }
      toast({ title: "Progress Saved!", description: `Your score of ${percentage}% has been recorded.` });
    } catch (error: any) { console.error("Error saving quiz attempt:", error); }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
    setShowFeedback(false);
    setTimerActive(true);
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setShowResults(false);
    setTimerActive(false);
  };

  // Active quiz view
  if (selectedQuiz && !showResults) {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const options = [
      { key: "A", value: currentQuestion.option_a },
      { key: "B", value: currentQuestion.option_b },
      { key: "C", value: currentQuestion.option_c },
      { key: "D", value: currentQuestion.option_d },
    ];
    const progressPercent = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;

    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:ml-64">
          <Topbar onSearch={() => {}} />
          <main className="p-4 md:p-6 space-y-6">
            <Card className="max-w-3xl mx-auto animate-fade-in">
              <CardHeader>
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <CardTitle>{selectedQuiz.subject} Quiz</CardTitle>
                  <div className="flex items-center gap-3">
                    <QuizTimer totalSeconds={30} onTimeUp={handleTimeUp} isActive={timerActive} key={currentQuestionIndex} />
                    <Badge variant="outline">Q {currentQuestionIndex + 1}/{selectedQuiz.questions.length}</Badge>
                  </div>
                </div>
                <Progress value={progressPercent} className="h-2 mt-3" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg font-medium text-foreground">{currentQuestion.question}</div>
                <div className="space-y-3">
                  {options.map((option) => {
                    let variant: "default" | "outline" | "destructive" = "outline";
                    let extraClass = "";
                    if (showFeedback) {
                      if (option.key === currentQuestion.correct_answer) {
                        variant = "default";
                        extraClass = "bg-green-600 hover:bg-green-600 border-green-600";
                      } else if (option.key === selectedAnswer && !isCorrect) {
                        variant = "destructive";
                      }
                    } else if (selectedAnswer === option.key) {
                      variant = "default";
                    }

                    return (
                      <Button
                        key={option.key}
                        variant={variant}
                        className={`w-full justify-start text-left h-auto py-4 px-6 transition-all duration-200 ${extraClass}`}
                        onClick={() => handleAnswerSelect(option.key)}
                        disabled={showFeedback}
                      >
                        <span className="font-semibold mr-3">{option.key}.</span>
                        {option.value}
                        {showFeedback && option.key === currentQuestion.correct_answer && <CheckCircle className="ml-auto h-5 w-5" />}
                        {showFeedback && option.key === selectedAnswer && !isCorrect && <XCircle className="ml-auto h-5 w-5" />}
                      </Button>
                    );
                  })}
                </div>

                {showFeedback && (
                  <div className={`p-4 rounded-lg animate-fade-in ${isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-destructive/10 border border-destructive/30"}`}>
                    <p className={`font-semibold ${isCorrect ? "text-green-600" : "text-destructive"}`}>
                      {isCorrect ? "✅ Correct! Well done!" : `❌ Wrong! The correct answer is ${currentQuestion.correct_answer}.`}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleBackToQuizzes} className="flex-1">Back</Button>
                  {!showFeedback ? (
                    <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="flex-1">Submit Answer</Button>
                  ) : (
                    <Button onClick={handleNextQuestion} className="flex-1">
                      {currentQuestionIndex < selectedQuiz.questions.length - 1 ? "Next Question" : "See Results"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  // Results view
  if (showResults) {
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    const emoji = percentage >= 80 ? "🏆" : percentage >= 50 ? "👍" : "💪";

    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:ml-64">
          <Topbar onSearch={() => {}} />
          <main className="p-4 md:p-6 space-y-6">
            <Card className="max-w-2xl mx-auto text-center animate-fade-in">
              <CardHeader>
                <CardTitle className="text-3xl">Quiz Complete! {emoji}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray={`${percentage}, 100`} className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">{percentage}%</span>
                  </div>
                </div>
                <p className="text-muted-foreground">You scored {score} out of {selectedQuiz.questions.length}</p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={handleBackToQuizzes}>Back to Quizzes</Button>
                  <Button onClick={handleRetakeQuiz}>Retake Quiz</Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  // Quiz list view
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar onSearch={() => {}} />
        <main className="p-4 md:p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />Quizzes
            </h1>
            <p className="text-muted-foreground mt-1">Test your knowledge and track your progress</p>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search quizzes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>

          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <Badge key={subject} variant={activeSubject === subject ? "default" : "outline"} className="cursor-pointer transition-all hover:scale-105" onClick={() => setActiveSubject(subject)}>{subject}</Badge>
            ))}
          </div>

          {loading ? (
            <Card className="p-12 text-center"><p className="text-muted-foreground">Loading quizzes...</p></Card>
          ) : filteredQuizzes.length === 0 ? (
            <Card className="p-12 text-center"><p className="text-muted-foreground">No quizzes found</p></Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuizzes.map((quiz, i) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <CardHeader>
                    <CardTitle>{quiz.subject}</CardTitle>
                    <Badge variant="secondary">{quiz.questions.length} Questions</Badge>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full group" onClick={() => startQuiz(quiz)}>
                      <Brain className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
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
