import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  TrendingUp,
  Heart,
  Settings,
  Menu,
  X,
  Quote,
} from "lucide-react";
import { Button } from "./ui/button";

import { Shield, User, BookOpenIcon } from "lucide-react";

const navItems = [
  { title: "Home", icon: LayoutDashboard, path: "/" },
  { title: "Profile", icon: User, path: "/profile" },
  { title: "Courses", icon: BookOpenIcon, path: "/courses" },
  { title: "Notes", icon: FileText, path: "/notes" },
  { title: "Quizzes", icon: BookOpen, path: "/quizzes" },
  { title: "Progress", icon: TrendingUp, path: "/progress" },
  { title: "Life Skills", icon: Heart, path: "/life-skills" },
  { title: "Settings", icon: Settings, path: "/settings" },
  { title: "Admin", icon: Shield, path: "/admin", adminOnly: true },
];

const motivationalQuotes = [
  "Education is the most powerful weapon to change the world.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Education is the passport to the future.",
  "Learning is a treasure that will follow its owner everywhere.",
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  
  useEffect(() => {
    checkUserRoles();
  }, []);
  
  const checkUserRoles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
        
      if (!error && data) {
        setUserRoles(data.map(r => r.role));
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-card border-r border-border z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Aarambh
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Learn. Grow. Succeed.</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            // Hide admin link if user is not admin
            if (item.adminOnly && !userRoles.includes('admin')) {
              return null;
            }
            
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-foreground hover:bg-muted"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Quote of the day */}
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="flex items-start gap-2">
            <Quote className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
            <p className="text-xs text-muted-foreground italic">{randomQuote}</p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
