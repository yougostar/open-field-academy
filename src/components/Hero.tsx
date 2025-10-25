import { Button } from "@/components/ui/button";
import { BookOpen, Globe, Sparkles, Users } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-soft">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Empowering Rural Education</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Learn Anywhere, Anytime with{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Smart Learning
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              An innovative educational platform designed for rural children, featuring offline capabilities, 
              multi-language support, and AI-powered personalized learning paths.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="hero" size="lg" className="group">
                Get Started
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-6 pt-6 border-t border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">For Students</p>
                  <p className="font-semibold text-foreground">Engaging Lessons</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Multi-Language</p>
                  <p className="font-semibold text-foreground">Local Support</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full"></div>
            <img
              src={heroImage}
              alt="Children learning with educational technology"
              className="relative rounded-2xl shadow-elevated w-full h-auto animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
