import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TrendingUp, Award, BookOpen, Target, Flame, Calendar, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ProgressTracker = () => {
  const { toast } = useToast();
  const [showWeeklyView, setShowWeeklyView] = useState(false);
  const [showOnlyCompleted, setShowOnlyCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    currentStreak: 0,
    totalPoints: 0,
    achievements: 0,
    avgScore: 0,
  });

  const [subjects, setSubjects] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchAllProgress();
  }, []);

  const fetchAllProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user stats
      const { data: userStatsData } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // Fetch all lessons count
      const { count: totalLessonsCount } = await supabase
        .from("lessons")
        .select("*", { count: "exact", head: true });

      // Fetch completed lessons count
      const { count: completedLessonsCount } = await supabase
        .from("lesson_completions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Fetch quiz attempts for average score
      const { data: quizAttemptsData } = await supabase
        .from("quiz_attempts")
        .select("score")
        .eq("user_id", user.id);

      const avgScore = quizAttemptsData && quizAttemptsData.length > 0
        ? Math.round(quizAttemptsData.reduce((sum, a) => sum + a.score, 0) / quizAttemptsData.length)
        : 0;

      // Fetch recent quiz attempts
      const { data: recentAttemptsData } = await supabase
        .from("quiz_attempts")
        .select("*, quizzes(question, subject)")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(5);

      // Fetch subject progress
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("*");

      const subjectProgress = await Promise.all(
        (subjectsData || []).map(async (subject) => {
          // Get quizzes for this subject
          const { data: subjectQuizzes } = await supabase
            .from("quizzes")
            .select("id")
            .eq("subject", subject.name);

          // Get completed quizzes for this subject
          const { data: completedQuizzes } = await supabase
            .from("quiz_attempts")
            .select("quiz_id, score")
            .eq("user_id", user.id)
            .in("quiz_id", (subjectQuizzes || []).map(q => q.id));

          const total = subjectQuizzes?.length || 0;
          const completed = new Set(completedQuizzes?.map(q => q.quiz_id) || []).size;
          const subjectAvgScore = completedQuizzes && completedQuizzes.length > 0
            ? Math.round(completedQuizzes.reduce((sum, a) => sum + a.score, 0) / completedQuizzes.length)
            : 0;

          return {
            name: subject.name,
            completed,
            total,
            score: subjectAvgScore,
            color: "bg-primary"
          };
        })
      );

      const achievementsArray = Array.isArray(userStatsData?.achievements) 
        ? userStatsData.achievements 
        : [];

      setStats({
        totalLessons: totalLessonsCount || 0,
        completedLessons: completedLessonsCount || 0,
        currentStreak: userStatsData?.current_streak || 0,
        totalPoints: userStatsData?.total_points || 0,
        achievements: achievementsArray.length,
        avgScore,
      });

      setSubjects(subjectProgress);
      setRecentActivity(
        (recentAttemptsData || []).map(attempt => ({
          date: new Date(attempt.completed_at).toLocaleDateString(),
          lesson: attempt.quizzes?.question?.substring(0, 50) + "..." || "Quiz",
          score: attempt.score,
          category: attempt.quizzes?.subject || "General"
        }))
      );
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading progress...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar onSearch={() => {}} />
        
        <main className="p-4 md:p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Progress Tracker
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor your learning journey and achievements
            </p>
          </div>

          {/* View Controls */}
          <Card className="border-primary/50">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="weekly-view"
                    checked={showWeeklyView}
                    onCheckedChange={setShowWeeklyView}
                  />
                  <Label htmlFor="weekly-view" className="cursor-pointer">
                    Weekly View
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="completed-only"
                    checked={showOnlyCompleted}
                    onCheckedChange={setShowOnlyCompleted}
                  />
                  <Label htmlFor="completed-only" className="cursor-pointer">
                    Show Only Completed
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="border-primary/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.completedLessons}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-warning/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-warning">{stats.currentStreak}</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-success/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">{stats.totalPoints}</div>
                    <div className="text-xs text-muted-foreground">Points</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-info/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-info">{stats.achievements}</div>
                    <div className="text-xs text-muted-foreground">Badges</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">{stats.avgScore}%</div>
                    <div className="text-xs text-muted-foreground">Avg Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">{stats.totalLessons}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  {stats.completedLessons} of {stats.totalLessons} lessons completed
                </span>
                <span className="font-semibold text-foreground">
                  {stats.totalLessons > 0 ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0}%
                </span>
              </div>
              <Progress
                value={stats.totalLessons > 0 ? (stats.completedLessons / stats.totalLessons) * 100 : 0}
                className="h-3"
              />
            </CardContent>
          </Card>

          {/* Subject Progress */}
          <div className="grid md:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Card key={subject.name} className="hover:shadow-elevated transition-all">
                <CardHeader>
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        {subject.completed}/{subject.total}
                      </span>
                    </div>
                    <Progress
                      value={subject.total > 0 ? (subject.completed / subject.total) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Average Score</span>
                    <Badge variant="secondary" className="gap-1">
                      <Star className="h-3 w-3" />
                      {subject.score}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{activity.lesson}</div>
                          <div className="text-sm text-muted-foreground">{activity.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge>{activity.category}</Badge>
                        <div className="text-lg font-bold text-success">{activity.score}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No activity yet. Start completing quizzes and lessons to track your progress!
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ProgressTracker;
