import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Brain, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const RecentActivityFeed = () => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("quiz_attempts")
      .select("*, quizzes(question, subject)")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(5);

    setActivities(data || []);
  };

  if (activities.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {activities.map((a, i) => (
          <div
            key={a.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {a.quizzes?.subject || "Quiz"} Quiz
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(a.completed_at).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={a.score >= 80 ? "default" : "secondary"} className="flex-shrink-0">
              {a.score}%
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
