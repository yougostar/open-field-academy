import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Brain, TrendingUp, BookOpen, Lightbulb, FolderOpen } from "lucide-react";

const actions = [
  { icon: FileText, label: "Study Notes", description: "Download class-wise notes", path: "/notes", gradient: "from-blue-500 to-cyan-500" },
  { icon: Brain, label: "Take Quiz", description: "Test your knowledge", path: "/quizzes", gradient: "from-purple-500 to-pink-500" },
  { icon: TrendingUp, label: "My Progress", description: "Track your learning", path: "/progress", gradient: "from-green-500 to-emerald-500" },
  { icon: BookOpen, label: "Courses", description: "Explore all courses", path: "/courses", gradient: "from-orange-500 to-amber-500" },
  { icon: Lightbulb, label: "Life Skills", description: "Practical skills", path: "/life-skills", gradient: "from-rose-500 to-red-500" },
  { icon: FolderOpen, label: "Resources", description: "Study materials", path: "/resources", gradient: "from-indigo-500 to-violet-500" },
];

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action, i) => (
          <Card
            key={action.label}
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            onClick={() => navigate(action.path)}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <CardContent className="p-4 text-center space-y-2">
              <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">{action.label}</div>
                <div className="text-xs text-muted-foreground hidden sm:block">{action.description}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
