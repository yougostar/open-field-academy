import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Library, Search, ExternalLink, FileText, Video, File } from "lucide-react";

const StudyResources = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from("study_resources")
        .select("*, profiles(name)")
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subjects = ["All", "Programming", "Algorithms", "Web Technology", "Cybersecurity"];
  const [activeSubject, setActiveSubject] = useState("All");

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = activeSubject === "All" || resource.subject === activeSubject;

    return matchesSearch && matchesSubject;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "pdf":
        return <File className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar onSearch={() => {}} />

        <main className="p-4 md:p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Library className="h-8 w-8 text-primary" />
              Study Resources
            </h1>
            <p className="text-muted-foreground mt-1">
              Access articles, videos, and documents to enhance your learning
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Subject Filter */}
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <Badge
                key={subject}
                variant={activeSubject === subject ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveSubject(subject)}
              >
                {subject}
              </Badge>
            ))}
          </div>

          {loading ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Loading resources...</p>
            </Card>
          ) : filteredResources.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No resources found</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-elevated transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <Badge variant="secondary" className="mb-2">
                          {resource.subject}
                        </Badge>
                        <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          {getTypeIcon(resource.type)}
                          <span className="capitalize">{resource.type}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => window.open(resource.link, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Resource
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3">
                      By {resource.profiles?.name || "Unknown"} •{" "}
                      {new Date(resource.uploaded_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudyResources;
