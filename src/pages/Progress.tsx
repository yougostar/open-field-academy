import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Leaderboard } from "@/components/Leaderboard";
import { AchievementBadges } from "@/components/AchievementBadges";
import { TrendingUp, Award, BookOpen, Target, Flame, Calendar, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ProgressTracker = () => {
  const { toast } = useToast();
  const [showWeeklyView, setShowWeeklyView] = useState(false);
  const [showOnlyCompleted, setShowOnlyCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalLessons: 0, completedLessons: 0, currentStreak: 0,
    totalPoints: 0, achievements: 0, avgScore: 0, quizzesTaken: 0,
  });

  const [subjects, setSubjects] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => { fetchAllProgress(); }, []);

  const fetchAllProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [userStatsRes, totalLessonsRes, completedLessonsRes, quizAttemptsRes, recentAttemptsRes, subjectsRes] = await Promise.all([
        supabase.from("user_stats").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("lessons").select("*", { count: "exact", head: true }),
        supabase.from("lesson_completions").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("quiz_attempts").select("score").eq("user_id", user.id),
        supabase.from("quiz_attempts").select("*, quizzes(question, subject)").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(5),
        supabase.from("subjects").select("*"),
      ]);

      const scores = quizAttemptsRes.data || [];
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((sum, a) => sum + a.score, 0) / scores.length) : 0;

      const subjectProgress = await Promise.all(
        (subjectsRes.data || []).map(async (subject) => {
          const { data: sq } = await supabase.from("quizzes").select("id").eq("subject", subject.name);
          const { data: cq } = await supabase.from("quiz_attempts").select("quiz_id, score").eq("user_id", user.id).in("quiz_id", (sq || []).map(q => q.id));
          const total = sq?.length || 0;
          const completed = new Set(cq?.map(q => q.quiz_id) || []).size;
          const subjectAvgScore = cq && cq.length > 0 ? Math.round(cq.reduce((sum, a) => sum + a.score, 0) / cq.length) : 0;
          return { name: subject.name, completed, total, score: subjectAvgScore, color: "bg-primary" };
        })
      );

      const achievementsArray = Array.isArray(userStatsRes.data?.achievements) ? userStatsRes.data.achievements : [];

      setStats({
        totalLessons: totalLessonsRes.count || 0,
        completedLessons: completedLessonsRes.count || 0,
        currentStreak: userStatsRes.data?.current_streak || 0,
        totalPoints: userStatsRes.data?.total_points || 0,
        achievements: achievementsArray.length,
        avgScore,
        quizzesTaken: scores.length,
      });
      setSubjects(subjectProgress);
      setRecentActivity((recentAttemptsRes.data || []).map(a => ({
        date: new Date(a.completed_at).toLocaleDateString(),
        lesson: a.quizzes?.question?.substring(0, 50) + "..." || "Quiz",
        score: a.score,
        category: a.quizzes?.subject || "General"
      })));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading progress...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar onSearch={() => {}} />
        <main className="p-4 md:p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />Progress Tracker
            </h1>
            <p className="text-muted-foreground mt-1">Monitor your learning journey and achievements</p>
          </div>

          <Card className="border-primary/50">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch id="weekly-view" checked={showWeeklyView} onCheckedChange={setShowWeeklyView} />
                  <Label htmlFor="weekly-view" className="cursor-pointer">Weekly View</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="completed-only" checked={showOnlyCompleted} onCheckedChange={setShowOnlyCompleted} />
                  <Label htmlFor="completed-only" className="cursor-pointer">Show Only Completed</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: BookOpen, value: stats.completedLessons, label: "Completed", borderColor: "border-primary/50", iconBg: "bg-primary/10", iconColor: "text-primary", valueColor: "text-foreground" },
              { icon: Flame, value: stats.currentStreak, label: "Day Streak", borderColor: "border-orange-500/50", iconBg: "bg-orange-500/10", iconColor: "text-orange-500", valueColor: "text-orange-500" },
              { icon: Star, value: stats.totalPoints, label: "Points", borderColor: "border-yellow-500/50", iconBg: "bg-yellow-500/10", iconColor: "text-yellow-500", valueColor: "text-yellow-500" },
              { icon: Award, value: stats.achievements, label: "Badges", borderColor: "border-blue-500/50", iconBg: "bg-blue-500/10", iconColor: "text-blue-500", valueColor: "text-blue-500" },
              { icon: Target, value: `${stats.avgScore}%`, label: "Avg Score", borderColor: "border-emerald-500/50", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500", valueColor: "text-emerald-500" },
              { icon: Calendar, value: stats.totalLessons, label: "Total", borderColor: "border-purple-500/50", iconBg: "bg-purple-500/10", iconColor: "text-purple-500", valueColor: "text-purple-500" },
            ].map((s, i) => (
              <Card key={i} className={`${s.borderColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${s.iconBg} flex items-center justify-center`}>
                      <s.icon className={`h-5 w-5 ${s.iconColor}`} />
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${s.valueColor}`}>{s.value}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Overall Progress */}
          <Card>
            <CardHeader><CardTitle>Overall Progress</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{stats.completedLessons} of {stats.totalLessons} lessons completed</span>
                <span className="font-semibold text-foreground">{stats.totalLessons > 0 ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0}%</span>
              </div>
              <Progress value={stats.totalLessons > 0 ? (stats.completedLessons / stats.totalLessons) * 100 : 0} className="h-3" />
            </CardContent>
          </Card>

          {/* Achievement Badges */}
          <AchievementBadges
            completedLessons={stats.completedLessons}
            quizzesTaken={stats.quizzesTaken}
            streak={stats.currentStreak}
            points={stats.totalPoints}
            avgScore={stats.avgScore}
          />

          {/* Subject Progress + Leaderboard */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <Card key={subject.name} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader><CardTitle className="text-lg">{subject.name}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{subject.completed}/{subject.total}</span>
                      </div>
                      <Progress value={subject.total > 0 ? (subject.completed / subject.total) * 100 : 0} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Average Score</span>
                      <Badge variant="secondary" className="gap-1"><Star className="h-3 w-3" />{subject.score}%</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Leaderboard />
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
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
                        <div className="text-lg font-bold text-emerald-500">{activity.score}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No activity yet. Start completing quizzes and lessons to track your progress!</p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ProgressTracker;
