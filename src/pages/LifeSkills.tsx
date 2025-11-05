import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Lightbulb, Shield, Smile, Target } from "lucide-react";

const LifeSkills = () => {
  const skills = [
    {
      icon: Heart,
      title: "Emotional Intelligence",
      description: "Learn to understand and manage your emotions effectively",
      lessons: 8,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      icon: Users,
      title: "Communication Skills",
      description: "Master the art of expressing yourself and listening to others",
      lessons: 10,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Lightbulb,
      title: "Critical Thinking",
      description: "Develop problem-solving and analytical thinking abilities",
      lessons: 12,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      icon: Shield,
      title: "Digital Safety",
      description: "Stay safe online and protect your digital identity",
      lessons: 6,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      icon: Smile,
      title: "Mental Wellness",
      description: "Build resilience and maintain positive mental health",
      lessons: 9,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Learn to set and achieve your personal and academic goals",
      lessons: 7,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar onSearch={() => {}} />
        
        <main className="p-4 md:p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Heart className="h-8 w-8 text-primary" />
              Life Skills
            </h1>
            <p className="text-muted-foreground mt-1">
              Essential skills for personal growth and success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-elevated transition-all hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-2xl ${skill.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-8 w-8 ${skill.color}`} />
                    </div>
                    <CardTitle>{skill.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Badge variant="secondary">{skill.lessons} Lessons</Badge>
                      <Button size="sm">Start Learning</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LifeSkills;
