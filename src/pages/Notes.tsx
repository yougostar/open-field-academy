import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileText, Search, Upload, Download, Eye, Plus, Trash2 } from "lucide-react";

const Notes = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();
      setIsAdmin(!!data);
    }
  };

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*, profiles(name)")
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
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

  const classes = ["All", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
  const subjects = ["All", "Maths", "Science", "Social Science", "Hindi", "English"];
  const [activeClass, setActiveClass] = useState("All");
  const [activeSubject, setActiveSubject] = useState("All");
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    subject: "Maths",
    class: "Class 1",
    file: null as File | null,
  });

  const handleUpload = async () => {
    if (!newNote.title || !newNote.file) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select a PDF file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload file to storage
      const fileExt = newNote.file.name.split(".").pop();
      const fileName = `${Date.now()}_${newNote.title.replace(/\s+/g, "_")}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("notes")
        .upload(fileName, newNote.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("notes")
        .getPublicUrl(fileName);

      // Create note record
      const { error: insertError } = await supabase.from("notes").insert({
        title: newNote.title,
        subject: newNote.subject,
        class: newNote.class,
        file_url: publicUrl,
        content: `PDF: ${newNote.title}`,
        uploaded_by: user.id,
      });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Note uploaded successfully",
      });

      setUploadDialogOpen(false);
      setNewNote({ title: "", subject: "Maths", class: "Class 1", file: null });
      fetchNotes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (noteId: string, fileUrl: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      // Extract file name from URL
      const fileName = fileUrl.split("/").pop();
      
      // Delete from storage
      if (fileName) {
        await supabase.storage.from("notes").remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase.from("notes").delete().eq("id", noteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note deleted successfully",
      });

      fetchNotes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = activeClass === "All" || note.class === activeClass;
    const matchesSubject = activeSubject === "All" || note.subject === activeSubject;

    return matchesSearch && matchesClass && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar onSearch={() => {}} />

        <main className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <FileText className="h-8 w-8 text-primary" />
                Study Notes
              </h1>
              <p className="text-muted-foreground mt-1">
                Download class and subject-wise study materials
              </p>
            </div>
            {isAdmin && (
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Note
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload New Note</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        placeholder="Enter note title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="class">Class</Label>
                      <Select
                        value={newNote.class}
                        onValueChange={(value) => setNewNote({ ...newNote, class: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.filter(c => c !== "All").map((cls) => (
                            <SelectItem key={cls} value={cls}>
                              {cls}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={newNote.subject}
                        onValueChange={(value) => setNewNote({ ...newNote, subject: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.filter(s => s !== "All").map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="file">PDF File</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setNewNote({ ...newNote, file: e.target.files?.[0] || null })}
                      />
                    </div>
                    <Button onClick={handleUpload} disabled={uploading} className="w-full">
                      {uploading ? "Uploading..." : "Upload Note"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Class Filter */}
          <div>
            <p className="text-sm font-medium mb-2">Filter by Class:</p>
            <div className="flex flex-wrap gap-2">
              {classes.map((cls) => (
                <Badge
                  key={cls}
                  variant={activeClass === cls ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setActiveClass(cls)}
                >
                  {cls}
                </Badge>
              ))}
            </div>
          </div>

          {/* Subject Filter */}
          <div>
            <p className="text-sm font-medium mb-2">Filter by Subject:</p>
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
          </div>

          {loading ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Loading notes...</p>
            </Card>
          ) : filteredNotes.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No notes found</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-2 flex-1">
                        <div className="flex gap-2">
                          <Badge variant="secondary">{note.class}</Badge>
                          <Badge variant="outline">{note.subject}</Badge>
                        </div>
                        <CardTitle className="text-lg">{note.title}</CardTitle>
                        <CardDescription className="text-xs">
                          Uploaded {new Date(note.uploaded_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <FileText className="h-8 w-8 text-primary opacity-50" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {note.file_url && (
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() => window.open(note.file_url, "_blank")}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            const a = document.createElement("a");
                            a.href = note.file_url;
                            a.download = `${note.title}.pdf`;
                            a.click();
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                    {isAdmin && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => handleDelete(note.id, note.file_url)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
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

export default Notes;
