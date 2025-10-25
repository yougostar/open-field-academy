import { Card, CardContent } from "@/components/ui/card";
import { 
  Wifi, 
  Globe2, 
  Gamepad2, 
  Brain, 
  BarChart3, 
  MessageCircle, 
  Shield, 
  Smartphone 
} from "lucide-react";
import offlineImage from "@/assets/feature-offline.jpg";
import multilangImage from "@/assets/feature-multilang.jpg";
import gamificationImage from "@/assets/feature-gamification.jpg";
import aiImage from "@/assets/feature-ai.jpg";

const features = [
  {
    icon: Wifi,
    title: "Offline Functionality",
    description: "Learn without interruption, even with unstable internet. Content syncs automatically when online.",
    image: offlineImage,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Globe2,
    title: "Multi-Language Support",
    description: "Available in multiple languages with local dialect options for better understanding.",
    image: multilangImage,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Gamepad2,
    title: "Gamification & Rewards",
    description: "Earn stars, badges, and unlock achievements as you progress through lessons.",
    image: gamificationImage,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description: "Personalized learning paths that adapt to each student's pace and performance.",
    image: aiImage,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Comprehensive dashboards for teachers and parents to track student growth.",
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    icon: MessageCircle,
    title: "Easy Communication",
    description: "Built-in messaging with voice and text support for students, teachers, and parents.",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Privacy-first design with age-appropriate content and parental controls.",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: Smartphone,
    title: "Works on Any Device",
    description: "Optimized for smartphones and basic tablets - accessible to everyone.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Features Built for{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Rural Learning
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Every feature is designed with accessibility, engagement, and effectiveness in mind
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border-border/50"
              >
                <CardContent className="p-6 space-y-4">
                  {feature.image && (
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
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

export default Features;
