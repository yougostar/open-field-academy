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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Shield, Users, BookOpen, FileText, HelpCircle, Library, Pencil, Trash2, Check, X, Plus, Tag } from "lucide-react";

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
    subjects: 0,
  });

  // Data states
  const [notes, setNotes] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);

  // Dialog states
  const [editingNote, setEditingNote] = useState<any>(null);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [newSubject, setNewSubject] = useState({ name: "", description: "" });
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const [newLesson, setNewLesson] = useState({ course_id: "", title: "", content: "", order_number: 1 });
  const [searchTerm, setSearchTerm] = useState("");

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
      fetchAllData();
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

  const fetchAllData = async () => {
    await Promise.all([
      fetchStats(),
      fetchNotes(),
      fetchQuizzes(),
      fetchResources(),
      fetchUsers(),
      fetchSubjects(),
      fetchCourses(),
      fetchLessons(),
    ]);
  };

  const fetchStats = async () => {
    const [users, courses, notes, quizzes, resources, subjects] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("notes").select("*", { count: "exact", head: true }),
      supabase.from("quizzes").select("*", { count: "exact", head: true }),
      supabase.from("study_resources").select("*", { count: "exact", head: true }),
      supabase.from("subjects").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      users: users.count || 0,
      courses: courses.count || 0,
      notes: notes.count || 0,
      quizzes: quizzes.count || 0,
      resources: resources.count || 0,
      subjects: subjects.count || 0,
    });
  };

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*, profiles(name)")
      .order("uploaded_at", { ascending: false });
    
    if (!error && data) setNotes(data);
  };

  const fetchQuizzes = async () => {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*, profiles(name)")
      .order("created_at", { ascending: false });
    
    if (!error && data) setQuizzes(data);
  };

  const fetchResources = async () => {
    const { data, error } = await supabase
      .from("study_resources")
      .select("*, profiles(name)")
      .order("uploaded_at", { ascending: false });
    
    if (!error && data) setResources(data);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*, user_roles(role)")
      .order("created_at", { ascending: false });
    
    if (!error && data) setUsers(data);
  };

  const fetchSubjects = async () => {
    const { data, error} = await supabase
      .from("subjects")
      .select("*")
      .order("name");
    
    if (!error && data) setSubjects(data);
  };

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*, profiles(name)")
      .order("created_at", { ascending: false });
    
    if (!error && data) setCourses(data);
  };

  const fetchLessons = async () => {
    const { data, error } = await supabase
      .from("lessons")
      .select("*, courses(title)")
      .order("order_number");
    
    if (!error && data) setLessons(data);
  };

  const toggleApproval = async (table: string, id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from(table as any)
      .update({ approved: !currentStatus } as any)
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success!", description: `Content ${!currentStatus ? 'approved' : 'rejected'} successfully.` });
    fetchAllData();
  };

  const deleteItem = async (table: string, id: string, itemName: string) => {
    const { error } = await supabase.from(table as any).delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success!", description: `${itemName} deleted successfully.` });
    fetchAllData();
  };

  const updateNote = async () => {
    if (!editingNote) return;

    const { error } = await supabase
      .from("notes")
      .update({
        title: editingNote.title,
        subject: editingNote.subject,
        content: editingNote.content,
      } as any)
      .eq("id", editingNote.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success!", description: "Note updated successfully." });
    setEditingNote(null);
    fetchAllData();
  };

  const updateQuiz = async () => {
    if (!editingQuiz) return;

    const { error } = await supabase
      .from("quizzes")
      .update({
        subject: editingQuiz.subject,
        question: editingQuiz.question,
        option_a: editingQuiz.option_a,
        option_b: editingQuiz.option_b,
        option_c: editingQuiz.option_c,
        option_d: editingQuiz.option_d,
        correct_answer: editingQuiz.correct_answer,
      } as any)
      .eq("id", editingQuiz.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success!", description: "Quiz updated successfully." });
    setEditingQuiz(null);
    fetchAllData();
  };

  const changeUserRole = async (userId: string, newRole: 'student' | 'instructor' | 'admin') => {
    // First delete existing role
    await supabase.from("user_roles").delete().eq("user_id", userId);

    // Insert new role
    const { error } = await supabase
      .from("user_roles")
      .insert([{ user_id: userId, role: newRole }] as any);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success!", description: "User role updated successfully." });
    fetchUsers();
  };

  const createSubject = async () => {
    if (!newSubject.name) return;

    const { error } = await supabase
      .from("subjects")
      .insert(newSubject);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success!", description: "Subject created successfully." });
    setNewSubject({ name: "", description: "" });
    fetchAllData();
  };

  const updateSubject = async () => {
    if (!editingSubject) return;

    const { error } = await supabase
      .from("subjects")
      .update({ name: editingSubject.name, description: editingSubject.description })
      .eq("id", editingSubject.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success!", description: "Subject updated successfully." });
    setEditingSubject(null);
    fetchAllData();
  };

  const createCourse = async () => {
    if (!newCourse.title) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("courses")
      .insert({ ...newCourse, instructor_id: user.id });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success!", description: "Course created successfully." });
    setNewCourse({ title: "", description: "" });
    fetchAllData();
  };

  const updateCourse = async () => {
    if (!editingCourse) return;

    const { error } = await supabase
      .from("courses")
      .update({ title: editingCourse.title, description: editingCourse.description })
      .eq("id", editingCourse.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success!", description: "Course updated successfully." });
    setEditingCourse(null);
    fetchAllData();
  };

  const createLesson = async () => {
    if (!newLesson.course_id || !newLesson.title) return;

    const { error } = await supabase
      .from("lessons")
      .insert(newLesson);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success!", description: "Lesson created successfully." });
    setNewLesson({ course_id: "", title: "", content: "", order_number: 1 });
    fetchAllData();
  };

  const updateLesson = async () => {
    if (!editingLesson) return;

    const { error } = await supabase
      .from("lessons")
      .update({ 
        title: editingLesson.title, 
        content: editingLesson.content,
        order_number: editingLesson.order_number 
      })
      .eq("id", editingLesson.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success!", description: "Lesson updated successfully." });
    setEditingLesson(null);
    fetchAllData();
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Admin Control Panel
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage content, users, and platform settings
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
                  <FileText className="h-8 w-8 text-success" />
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
                  <HelpCircle className="h-8 w-8 text-warning" />
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
                  <Library className="h-8 w-8 text-info" />
                  <div>
                    <div className="text-2xl font-bold">{stats.resources}</div>
                    <div className="text-xs text-muted-foreground">Resources</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-secondary" />
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
                  <Tag className="h-8 w-8 text-accent" />
                  <div>
                    <div className="text-2xl font-bold">{stats.subjects}</div>
                    <div className="text-xs text-muted-foreground">Subjects</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
            </TabsList>

            {/* Courses Management */}
            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>Courses Management</CardTitle>
                  <CardDescription>Create and manage courses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Course title"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    />
                    <Input
                      placeholder="Description"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    />
                    <Button onClick={createCourse}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Instructor</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.title}</TableCell>
                            <TableCell className="max-w-md truncate">{course.description}</TableCell>
                            <TableCell>{course.profiles?.name || 'Unknown'}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingCourse(course)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Course</DialogTitle>
                                  </DialogHeader>
                                  {editingCourse && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Title</Label>
                                        <Input
                                          value={editingCourse.title}
                                          onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                                        />
                                      </div>
                                      <div>
                                        <Label>Description</Label>
                                        <Textarea
                                          value={editingCourse.description}
                                          onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                                        />
                                      </div>
                                      <Button onClick={updateCourse}>Save Changes</Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteItem("courses", course.id, "Course")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lessons Management */}
            <TabsContent value="lessons">
              <Card>
                <CardHeader>
                  <CardTitle>Lessons Management</CardTitle>
                  <CardDescription>Create and manage course lessons</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={newLesson.course_id} onValueChange={(value) => setNewLesson({ ...newLesson, course_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Order"
                      value={newLesson.order_number}
                      onChange={(e) => setNewLesson({ ...newLesson, order_number: parseInt(e.target.value) })}
                    />
                    <Input
                      placeholder="Lesson title"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                    />
                    <Input
                      placeholder="Content"
                      value={newLesson.content}
                      onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                    />
                    <Button onClick={createLesson} className="col-span-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Content</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lessons.map((lesson) => (
                          <TableRow key={lesson.id}>
                            <TableCell>{lesson.order_number}</TableCell>
                            <TableCell className="font-medium">{lesson.title}</TableCell>
                            <TableCell>{lesson.courses?.title || 'Unknown'}</TableCell>
                            <TableCell className="max-w-md truncate">{lesson.content}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingLesson(lesson)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Lesson</DialogTitle>
                                  </DialogHeader>
                                  {editingLesson && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Order Number</Label>
                                        <Input
                                          type="number"
                                          value={editingLesson.order_number}
                                          onChange={(e) => setEditingLesson({ ...editingLesson, order_number: parseInt(e.target.value) })}
                                        />
                                      </div>
                                      <div>
                                        <Label>Title</Label>
                                        <Input
                                          value={editingLesson.title}
                                          onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                                        />
                                      </div>
                                      <div>
                                        <Label>Content</Label>
                                        <Textarea
                                          value={editingLesson.content}
                                          onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                                        />
                                      </div>
                                      <Button onClick={updateLesson}>Save Changes</Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteItem("lessons", lesson.id, "Lesson")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notes Management */}
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Notes Management</CardTitle>
                  <CardDescription>Approve, edit, or delete study notes</CardDescription>
                  <Input
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredNotes.map((note) => (
                          <TableRow key={note.id}>
                            <TableCell className="font-medium">{note.title}</TableCell>
                            <TableCell>{note.subject}</TableCell>
                            <TableCell>{note.profiles?.name || 'Unknown'}</TableCell>
                            <TableCell>
                              <Badge variant={note.approved ? "default" : "secondary"}>
                                {note.approved ? "Approved" : "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleApproval("notes", note.id, note.approved)}
                              >
                                {note.approved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingNote(note)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Note</DialogTitle>
                                    <DialogDescription>Make changes to the note</DialogDescription>
                                  </DialogHeader>
                                  {editingNote && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Title</Label>
                                        <Input
                                          value={editingNote.title}
                                          onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                                        />
                                      </div>
                                      <div>
                                        <Label>Subject</Label>
                                        <Input
                                          value={editingNote.subject}
                                          onChange={(e) => setEditingNote({ ...editingNote, subject: e.target.value })}
                                        />
                                      </div>
                                      <div>
                                        <Label>Content</Label>
                                        <Textarea
                                          value={editingNote.content}
                                          onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                                          rows={6}
                                        />
                                      </div>
                                      <Button onClick={updateNote}>Save Changes</Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteItem("notes", note.id, "Note")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quizzes Management */}
            <TabsContent value="quizzes">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Management</CardTitle>
                  <CardDescription>Approve, edit, or delete quiz questions</CardDescription>
                  <Input
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Question</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredQuizzes.map((quiz) => (
                          <TableRow key={quiz.id}>
                            <TableCell className="font-medium max-w-md truncate">{quiz.question}</TableCell>
                            <TableCell>{quiz.subject}</TableCell>
                            <TableCell>
                              <Badge variant={quiz.approved ? "default" : "secondary"}>
                                {quiz.approved ? "Approved" : "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleApproval("quizzes", quiz.id, quiz.approved)}
                              >
                                {quiz.approved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingQuiz(quiz)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Edit Quiz Question</DialogTitle>
                                  </DialogHeader>
                                  {editingQuiz && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Subject</Label>
                                        <Input
                                          value={editingQuiz.subject}
                                          onChange={(e) => setEditingQuiz({ ...editingQuiz, subject: e.target.value })}
                                        />
                                      </div>
                                      <div>
                                        <Label>Question</Label>
                                        <Textarea
                                          value={editingQuiz.question}
                                          onChange={(e) => setEditingQuiz({ ...editingQuiz, question: e.target.value })}
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Option A</Label>
                                          <Input
                                            value={editingQuiz.option_a}
                                            onChange={(e) => setEditingQuiz({ ...editingQuiz, option_a: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label>Option B</Label>
                                          <Input
                                            value={editingQuiz.option_b}
                                            onChange={(e) => setEditingQuiz({ ...editingQuiz, option_b: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label>Option C</Label>
                                          <Input
                                            value={editingQuiz.option_c}
                                            onChange={(e) => setEditingQuiz({ ...editingQuiz, option_c: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label>Option D</Label>
                                          <Input
                                            value={editingQuiz.option_d}
                                            onChange={(e) => setEditingQuiz({ ...editingQuiz, option_d: e.target.value })}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <Label>Correct Answer</Label>
                                        <Select
                                          value={editingQuiz.correct_answer}
                                          onValueChange={(value) => setEditingQuiz({ ...editingQuiz, correct_answer: value })}
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
                                      <Button onClick={updateQuiz}>Save Changes</Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteItem("quizzes", quiz.id, "Quiz")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Management */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user roles and permissions</CardDescription>
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Current Role</TableHead>
                          <TableHead className="text-right">Change Role</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge>
                                {user.user_roles?.[0]?.role || 'student'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Select
                                value={user.user_roles?.[0]?.role || 'student'}
                                onValueChange={(value) => changeUserRole(user.id, value as 'student' | 'instructor' | 'admin')}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="student">Student</SelectItem>
                                  <SelectItem value="instructor">Instructor</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subjects Management */}
            <TabsContent value="subjects">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Management</CardTitle>
                  <CardDescription>Add, edit, or remove subjects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Subject name"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    />
                    <Input
                      placeholder="Description"
                      value={newSubject.description}
                      onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                    />
                    <Button onClick={createSubject}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subjects.map((subject) => (
                          <TableRow key={subject.id}>
                            <TableCell className="font-medium">{subject.name}</TableCell>
                            <TableCell>{subject.description}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingSubject(subject)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Subject</DialogTitle>
                                  </DialogHeader>
                                  {editingSubject && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Name</Label>
                                        <Input
                                          value={editingSubject.name}
                                          onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                                        />
                                      </div>
                                      <div>
                                        <Label>Description</Label>
                                        <Input
                                          value={editingSubject.description}
                                          onChange={(e) => setEditingSubject({ ...editingSubject, description: e.target.value })}
                                        />
                                      </div>
                                      <Button onClick={updateSubject}>Save Changes</Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteItem("subjects", subject.id, "Subject")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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