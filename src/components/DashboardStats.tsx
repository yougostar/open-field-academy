import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Star, BookOpen, Target, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const DashboardStats = () => {
  const [stats, setStats] = useState({
    streak: 0,
    points: 0,
    completed: 0,
    avgScore: 0,
    quizzesTaken: 0,
  });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    fetchStats();
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const fetchStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [userStats, completions, attempts] = await Promise.all([
      supabase.from("user_stats").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("lesson_completions").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("quiz_attempts").select("score").eq("user_id", user.id),
    ]);

    const scores = attempts.data || [];
    const avg = scores.length > 0 ? Math.round(scores.reduce((s, a) => s + a.score, 0) / scores.length) : 0;

    setStats({
      streak: userStats.data?.current_streak || 0,
      points: userStats.data?.total_points || 0,
      completed: completions.count || 0,
      avgScore: avg,
      quizzesTaken: scores.length,
    });
  };

  const statItems = [
    { icon: Flame, label: "Day Streak", value: stats.streak, color: "text-orange-500", bg: "bg-orange-500/10" },
    { icon: Star, label: "Total Points", value: stats.points, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { icon: BookOpen, label: "Lessons Done", value: stats.completed, color: "text-primary", bg: "bg-primary/10" },
    { icon: Target, label: "Avg Score", value: `${stats.avgScore}%`, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: Trophy, label: "Quizzes Taken", value: stats.quizzesTaken, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {statItems.map((item, i) => (
        <Card
          key={item.label}
          className={`group hover:shadow-lg transition-all duration-500 hover:-translate-y-1 cursor-default ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: `${i * 80}ms` }}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
