import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, BookOpen, Trophy, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Simple Onboarding",
    description: "Quick and easy account creation for students, teachers, and parents with minimal steps.",
    step: "01",
  },
  {
    icon: BookOpen,
    title: "Start Learning",
    description: "Access interactive lessons, complete assignments, and engage with gamified content.",
    step: "02",
  },
  {
    icon: Trophy,
    title: "Earn Rewards",
    description: "Collect stars, badges, and achievements as you progress through your learning journey.",
    step: "03",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Teachers and parents monitor student performance through comprehensive analytics.",
    step: "04",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            How It{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Four simple steps to transform rural education
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card 
                key={index}
                className="relative overflow-hidden border-border/50 hover:shadow-elevated transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-primary opacity-10 rounded-bl-full"></div>
                
                <CardContent className="p-6 space-y-4 relative">
                  <div className="text-5xl font-bold text-primary/20">
                    {step.step}
                  </div>
                  
                  <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
