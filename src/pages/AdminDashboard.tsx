import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Shield, Users, BookOpen, FileText, HelpCircle, Library } from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    notes: 0,
    quizzes: 0,
    resources: 0,
  });

  // Form states
  const [courseForm, setCourseForm] = useState({ title: "", description: "" });
  const [noteForm, setNoteForm] = useState({ subject: "", title: "", content: "" });
  const [quizForm, setQuizForm] = useState({
    subject: "",
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A",
  });
  const [resourceForm, setResourceForm] = useState({
    subject: "",
    title: "",
    type: "article",
    link: "",
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user has admin role
      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (error || !roleData) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    const [users, courses, notes, quizzes, resources] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("notes").select("*", { count: "exact", head: true }),
      supabase.from("quizzes").select("*", { count: "exact", head: true }),
      supabase.from("study_resources").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      users: users.count || 0,
      courses: courses.count || 0,
      notes: notes.count || 0,
      quizzes: quizzes.count || 0,
      resources: resources.count || 0,
    });
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("courses").insert({
        ...courseForm,
        instructor_id: user.id,
      });

      if (error) throw error;

      toast({ title: "Success!", description: "Course created successfully." });
      setCourseForm({ title: "", description: "" });
      fetchStats();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("notes").insert({
        ...noteForm,
        uploaded_by: user.id,
      });

      if (error) throw error;

      toast({ title: "Success!", description: "Note created successfully." });
      setNoteForm({ subject: "", title: "", content: "" });
      fetchStats();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("quizzes").insert({
        ...quizForm,
        created_by: user.id,
      });

      if (error) throw error;

      toast({ title: "Success!", description: "Quiz created successfully." });
      setQuizForm({
        subject: "",
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "A",
      });
      fetchStats();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("study_resources").insert({
        ...resourceForm,
        uploaded_by: user.id,
      });

      if (error) throw error;

      toast({ title: "Success!", description: "Resource created successfully." });
      setResourceForm({ subject: "", title: "", type: "article", link: "" });
      fetchStats();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar onSearch={() => {}} />
        
        <main className="p-4 md:p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage users, courses, notes, quizzes, and study resources
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{stats.users}</div>
                    <div className="text-xs text-muted-foreground">Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-success" />
                  <div>
                    <div className="text-2xl font-bold">{stats.courses}</div>
                    <div className="text-xs text-muted-foreground">Courses</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-warning" />
                  <div>
                    <div className="text-2xl font-bold">{stats.notes}</div>
                    <div className="text-xs text-muted-foreground">Notes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-8 w-8 text-info" />
                  <div>
                    <div className="text-2xl font-bold">{stats.quizzes}</div>
                    <div className="text-xs text-muted-foreground">Quizzes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Library className="h-8 w-8 text-secondary" />
                  <div>
                    <div className="text-2xl font-bold">{stats.resources}</div>
                    <div className="text-xs text-muted-foreground">Resources</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Course</CardTitle>
                  <CardDescription>Add a new course to the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCourse} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="course-title">Course Title</Label>
                      <Input
                        id="course-title"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="course-description">Description</Label>
                      <Textarea
                        id="course-description"
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit">Create Course</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Note</CardTitle>
                  <CardDescription>Add a new study note</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateNote} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="note-subject">Subject</Label>
                      <Input
                        id="note-subject"
                        value={noteForm.subject}
                        onChange={(e) => setNoteForm({ ...noteForm, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="note-title">Title</Label>
                      <Input
                        id="note-title"
                        value={noteForm.title}
                        onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="note-content">Content</Label>
                      <Textarea
                        id="note-content"
                        value={noteForm.content}
                        onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                        required
                        rows={6}
                      />
                    </div>
                    <Button type="submit">Create Note</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quizzes">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Quiz Question</CardTitle>
                  <CardDescription>Add a new quiz question</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateQuiz} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="quiz-subject">Subject</Label>
                      <Input
                        id="quiz-subject"
                        value={quizForm.subject}
                        onChange={(e) => setQuizForm({ ...quizForm, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quiz-question">Question</Label>
                      <Textarea
                        id="quiz-question"
                        value={quizForm.question}
                        onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="option-a">Option A</Label>
                        <Input
                          id="option-a"
                          value={quizForm.option_a}
                          onChange={(e) => setQuizForm({ ...quizForm, option_a: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="option-b">Option B</Label>
                        <Input
                          id="option-b"
                          value={quizForm.option_b}
                          onChange={(e) => setQuizForm({ ...quizForm, option_b: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="option-c">Option C</Label>
                        <Input
                          id="option-c"
                          value={quizForm.option_c}
                          onChange={(e) => setQuizForm({ ...quizForm, option_c: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="option-d">Option D</Label>
                        <Input
                          id="option-d"
                          value={quizForm.option_d}
                          onChange={(e) => setQuizForm({ ...quizForm, option_d: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="correct-answer">Correct Answer</Label>
                      <Select
                        value={quizForm.correct_answer}
                        onValueChange={(value) => setQuizForm({ ...quizForm, correct_answer: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Option A</SelectItem>
                          <SelectItem value="B">Option B</SelectItem>
                          <SelectItem value="C">Option C</SelectItem>
                          <SelectItem value="D">Option D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit">Create Quiz</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Study Resource</CardTitle>
                  <CardDescription>Add a new study resource</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateResource} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resource-subject">Subject</Label>
                      <Input
                        id="resource-subject"
                        value={resourceForm.subject}
                        onChange={(e) => setResourceForm({ ...resourceForm, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resource-title">Title</Label>
                      <Input
                        id="resource-title"
                        value={resourceForm.title}
                        onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resource-type">Type</Label>
                      <Select
                        value={resourceForm.type}
                        onValueChange={(value) => setResourceForm({ ...resourceForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resource-link">Link/URL</Label>
                      <Input
                        id="resource-link"
                        type="url"
                        value={resourceForm.link}
                        onChange={(e) => setResourceForm({ ...resourceForm, link: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit">Create Resource</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
