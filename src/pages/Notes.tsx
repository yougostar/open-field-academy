import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Trash2, Edit, Star, Archive, Grid, List } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  isFavorite: boolean;
  isArchived: boolean;
  date: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Algebra Formulas",
      content: "Quadratic formula: x = (-b ± √(b²-4ac)) / 2a",
      category: "Math",
      isFavorite: true,
      isArchived: false,
      date: "2024-01-15",
    },
  ]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showArchived, setShowArchived] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "", category: "Math" });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNote = () => {
    if (!newNote.title || !newNote.content) {
      toast({ title: "Error", description: "Please fill in all fields" });
      return;
    }
    const note: Note = {
      id: Date.now().toString(),
      ...newNote,
      isFavorite: false,
      isArchived: false,
      date: new Date().toISOString().split("T")[0],
    };
    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "", category: "Math" });
    setIsCreating(false);
    toast({ title: "Success! 📝", description: "Note created successfully" });
  };

  const toggleFavorite = (id: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n)));
    toast({ title: "Updated", description: "Favorite status changed" });
  };

  const toggleArchive = (id: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, isArchived: !n.isArchived } : n)));
    toast({ title: "Updated", description: "Archive status changed" });
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    toast({ title: "Deleted", description: "Note removed successfully" });
  };

  const filteredNotes = notes.filter((n) => showArchived || !n.isArchived);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar onSearch={() => {}} />
        
        <main className="p-4 md:p-6 space-y-6">
          {/* Header with controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-primary" />
                My Notes
              </h1>
              <p className="text-muted-foreground mt-1">
                Create and organize your study notes
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View mode toggle */}
              <div className="flex gap-2 bg-muted p-1 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Show archived toggle */}
              <div className="flex items-center gap-2">
                <Switch
                  id="show-archived"
                  checked={showArchived}
                  onCheckedChange={setShowArchived}
                />
                <Label htmlFor="show-archived" className="cursor-pointer">
                  Show Archived
                </Label>
              </div>
              
              <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
                <Plus className="h-4 w-4" />
                New Note
              </Button>
            </div>
          </div>

          {/* Create note form */}
          {isCreating && (
            <Card className="border-primary/50 shadow-soft">
              <CardHeader>
                <CardTitle>Create New Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    placeholder="Enter note title..."
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Tabs value={newNote.category} onValueChange={(v) => setNewNote({ ...newNote, category: v })}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="Math">Math</TabsTrigger>
                      <TabsTrigger value="Science">Science</TabsTrigger>
                      <TabsTrigger value="English">English</TabsTrigger>
                      <TabsTrigger value="Other">Other</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea
                    placeholder="Write your notes here..."
                    rows={6}
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateNote}>Save Note</Button>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{notes.length}</div>
                <div className="text-sm text-muted-foreground">Total Notes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-warning">{notes.filter((n) => n.isFavorite).length}</div>
                <div className="text-sm text-muted-foreground">Favorites</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-success">{notes.filter((n) => !n.isArchived).length}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-muted-foreground">{notes.filter((n) => n.isArchived).length}</div>
                <div className="text-sm text-muted-foreground">Archived</div>
              </CardContent>
            </Card>
          </div>

          {/* Notes list */}
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
            {filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{note.category}</Badge>
                        {note.isArchived && <Badge variant="outline">Archived</Badge>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(note.id)}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          note.isFavorite ? "fill-warning text-warning" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-muted-foreground">{note.date}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleArchive(note.id)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <Card className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {showArchived ? "No archived notes" : "No notes yet. Create your first note!"}
              </p>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Notes;
