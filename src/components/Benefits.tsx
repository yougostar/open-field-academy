import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, Heart } from "lucide-react";

const benefits = [
  {
    icon: GraduationCap,
    title: "For Students",
    color: "text-primary",
    bgColor: "bg-primary/10",
    items: [
      "Learn at your own pace with AI-powered content",
      "Access lessons offline anytime, anywhere",
      "Earn rewards and badges for achievements",
      "Interactive and engaging learning experiences",
      "Available in your local language",
    ],
  },
  {
    icon: Users,
    title: "For Teachers",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    items: [
      "Easy lesson and assignment management",
      "Track student progress with detailed analytics",
      "Communicate with students and parents easily",
      "Upload content with minimal tech requirements",
      "Automated grading and feedback tools",
    ],
  },
  {
    icon: Heart,
    title: "For Parents",
    color: "text-accent",
    bgColor: "bg-accent/10",
    items: [
      "Monitor your child's learning progress",
      "Receive updates on achievements and milestones",
      "Stay connected with teachers",
      "Support your child's education from home",
      "Ensure safe and age-appropriate content",
    ],
  },
];

const Benefits = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Benefits for{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Everyone
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Empowering students, teachers, and parents in the learning journey
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={index}
                className="border-border/50 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl ${benefit.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 ${benefit.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {benefit.title}
                    </h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {benefit.items.map((item, itemIndex) => (
                      <li 
                        key={itemIndex}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${benefit.bgColor} mt-2 flex-shrink-0`}></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
