import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { LoadingScreen } from "@/components/LoadingScreen";
import { LessonCard } from "@/components/LessonCard";
import { GoogleTranslate } from "@/components/GoogleTranslate";
import { DashboardStats } from "@/components/DashboardStats";
import { QuickActions } from "@/components/QuickActions";
import { RecentActivityFeed } from "@/components/RecentActivityFeed";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";
import { allLessons } from "@/data/lessons";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLessons, setFilteredLessons] = useState(allLessons);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLessons(allLessons);
    } else {
      const filtered = allLessons.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lesson.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLessons(filtered);
    }
  }, [searchQuery]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
  };

  return (
    <>
      <LoadingScreen />
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:ml-64">
          <Topbar onSearch={setSearchQuery} />
          
          <main className="p-4 md:p-6 space-y-8">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-white">
                  <h1 className="text-4xl md:text-5xl font-bold">Welcome to Aarambh</h1>
                  <p className="text-lg text-white/90">
                    Start your learning journey with interactive lessons, offline access, and personalized progress tracking.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {deferredPrompt && (
                      <Button variant="secondary" size="lg" onClick={handleInstallClick} className="gap-2">
                        <Download className="h-5 w-5" />
                        Install App
                      </Button>
                    )}
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="search"
                        placeholder="Search lessons..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img src={heroImage} alt="Students learning" className="rounded-2xl shadow-elevated animate-float" />
                </div>
              </div>
            </section>

            {/* Dashboard Stats */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Progress</h2>
              <DashboardStats />
            </section>

            {/* Quick Actions */}
            <QuickActions />

            {/* Recent Activity + Google Translate */}
            <div className="grid md:grid-cols-2 gap-6">
              <RecentActivityFeed />
              <div className="space-y-4">
                <GoogleTranslate />
              </div>
            </div>

            {/* Categories */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Browse by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["All", "Maths", "Science", "English", "Hindi", "Social Science"].map((category) => (
                  <Button
                    key={category}
                    variant={searchQuery === category.toLowerCase() ? "default" : "outline"}
                    onClick={() => setSearchQuery(category === "All" ? "" : category.toLowerCase())}
                    className="h-auto py-4 transition-all duration-200 hover:scale-[1.02]"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </section>

            {/* Featured Lessons */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {searchQuery ? "Search Results" : "Featured Lessons"}
              </h2>
              {filteredLessons.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredLessons.map((lesson) => (
                    <LessonCard key={lesson.id} {...lesson} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No lessons found. Try a different search term.</p>
                </div>
              )}
            </section>
          </main>

          <footer className="border-t border-border mt-12 p-6 bg-muted/30">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 mb-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">Aarambh</h3>
                  <p className="text-sm text-muted-foreground">Empowering rural education through technology.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-primary">About Us</a></li>
                    <li><a href="#" className="hover:text-primary">Contact</a></li>
                    <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Support</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-primary">Help Center</a></li>
                    <li><a href="#" className="hover:text-primary">FAQ</a></li>
                    <li><a href="#" className="hover:text-primary">Community</a></li>
                  </ul>
                </div>
              </div>
              <div className="pt-6 border-t border-border text-center text-sm text-muted-foreground">
                &copy; 2024 Aarambh. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Index;
