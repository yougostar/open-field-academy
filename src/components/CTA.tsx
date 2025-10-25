import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 md:p-12 shadow-elevated">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
                Ready to Transform Rural Education?
              </h2>
              
              <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Join thousands of students, teachers, and parents who are already part of our learning community
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="group bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Contact Us
                  <Mail className="w-5 h-5" />
                </Button>
              </div>
              
              <p className="text-sm text-primary-foreground/70 pt-4">
                No credit card required • Free for the first 30 days • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
