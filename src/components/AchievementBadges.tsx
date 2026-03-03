import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookOpen, Brain, Flame, Star, Target, Trophy, Zap } from "lucide-react";

interface AchievementBadgesProps {
  completedLessons: number;
  quizzesTaken: number;
  streak: number;
  points: number;
  avgScore: number;
}

const allBadges = [
  { id: "first_lesson", label: "First Step", desc: "Complete your first lesson", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10", check: (p: AchievementBadgesProps) => p.completedLessons >= 1 },
  { id: "five_lessons", label: "Bookworm", desc: "Complete 5 lessons", icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-500/10", check: (p: AchievementBadgesProps) => p.completedLessons >= 5 },
  { id: "first_quiz", label: "Quiz Starter", desc: "Take your first quiz", icon: Brain, color: "text-purple-500", bg: "bg-purple-500/10", check: (p: AchievementBadgesProps) => p.quizzesTaken >= 1 },
  { id: "ten_quizzes", label: "Quiz Master", desc: "Take 10 quizzes", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10", check: (p: AchievementBadgesProps) => p.quizzesTaken >= 10 },
  { id: "streak_3", label: "On Fire", desc: "3-day streak", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", check: (p: AchievementBadgesProps) => p.streak >= 3 },
  { id: "streak_7", label: "Unstoppable", desc: "7-day streak", icon: Zap, color: "text-red-500", bg: "bg-red-500/10", check: (p: AchievementBadgesProps) => p.streak >= 7 },
  { id: "points_100", label: "Century", desc: "Earn 100 points", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", check: (p: AchievementBadgesProps) => p.points >= 100 },
  { id: "score_90", label: "A+ Student", desc: "90%+ average score", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10", check: (p: AchievementBadgesProps) => p.avgScore >= 90 },
  { id: "score_80", label: "High Scorer", desc: "80%+ average score", icon: Award, color: "text-green-500", bg: "bg-green-500/10", check: (p: AchievementBadgesProps) => p.avgScore >= 80 },
];

export const AchievementBadges = (props: AchievementBadgesProps) => {
  const earned = allBadges.filter((b) => b.check(props));
  const locked = allBadges.filter((b) => !b.check(props));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Achievements ({earned.length}/{allBadges.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {earned.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-primary/5 border border-primary/20 hover:scale-105 transition-transform cursor-default"
              title={badge.desc}
            >
              <div className={`w-10 h-10 rounded-full ${badge.bg} flex items-center justify-center`}>
                <badge.icon className={`h-5 w-5 ${badge.color}`} />
              </div>
              <span className="text-xs font-medium text-foreground text-center">{badge.label}</span>
            </div>
          ))}
          {locked.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-muted/50 border border-border opacity-40 cursor-default"
              title={`Locked: ${badge.desc}`}
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <badge.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium text-muted-foreground text-center">{badge.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
