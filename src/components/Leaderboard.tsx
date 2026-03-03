import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  name: string;
  points: number;
  streak: number;
  rank: number;
  isCurrentUser: boolean;
}

export const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: statsData } = await supabase
        .from("user_stats")
        .select("user_id, total_points, current_streak")
        .order("total_points", { ascending: false })
        .limit(10);

      if (!statsData) return;

      const userIds = statsData.map((s) => s.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p.name]) || []);

      setEntries(
        statsData.map((s, i) => ({
          name: profileMap.get(s.user_id) || "Student",
          points: s.total_points,
          streak: s.current_streak,
          rank: i + 1,
          isCurrentUser: s.user_id === user?.id,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />;
    return <span className="text-sm font-bold text-muted-foreground w-5 text-center">#{rank}</span>;
  };

  if (loading) return null;
  if (entries.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {entries.map((entry, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:scale-[1.01] ${
              entry.isCurrentUser
                ? "bg-primary/10 border border-primary/30"
                : "bg-muted/50 hover:bg-muted"
            }`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {getRankIcon(entry.rank)}
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-primary/20 text-primary">
                {entry.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-foreground truncate">
                {entry.name} {entry.isCurrentUser && <Badge variant="outline" className="ml-1 text-xs">You</Badge>}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-sm text-foreground">{entry.points} pts</div>
              <div className="text-xs text-muted-foreground">🔥 {entry.streak}d</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
