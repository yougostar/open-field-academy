import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TrendingUp, Award, BookOpen, Target, Flame, Calendar, Star } from "lucide-react";
import { useState } from "react";

const ProgressTracker = () => {
  const [showWeeklyView, setShowWeeklyView] = useState(false);
  const [showOnlyCompleted, setShowOnlyCompleted] = useState(false);

  const stats = {
    totalLessons: 45,
    completedLessons: 32,
    currentStreak: 7,
    totalPoints: 3240,
    achievements: 12,
    avgScore: 87,
  };

  const subjects = [
    { name: "Mathematics", completed: 12, total: 15, score: 92, color: "bg-primary" },
    { name: "Science", completed: 10, total: 15, score: 85, color: "bg-success" },
    { name: "English", completed: 10, total: 15, score: 88, color: "bg-warning" },
  ];

  const recentActivity = [
    { date: "2024-01-20", lesson: "Algebra Basics", score: 95, category: "Math" },
    { date: "2024-01-19", lesson: "Cell Structure", score: 88, category: "Science" },
    { date: "2024-01-18", lesson: "Grammar Rules", score: 92, category: "English" },
  ];

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
                  {Math.round((stats.completedLessons / stats.totalLessons) * 100)}%
                </span>
              </div>
              <Progress
                value={(stats.completedLessons / stats.totalLessons) * 100}
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
                      value={(subject.completed / subject.total) * 100}
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
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ProgressTracker;
