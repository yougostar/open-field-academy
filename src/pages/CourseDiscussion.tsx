import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MessageSquare, Send, Plus, MessageCircle, Clock, User } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { name: string } | null;
}

interface Thread {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { name: string } | null;
  reply_count?: number;
}

interface Reply {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { name: string } | null;
}

const CourseDiscussion = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Forum state
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newReply, setNewReply] = useState("");
  const [threadDialogOpen, setThreadDialogOpen] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUserId(user.id);

      const { data: course } = await supabase.from("courses").select("title").eq("id", courseId).single();
      if (course) setCourseTitle(course.title);

      fetchMessages();
      fetchThreads();
    };
    init();
  }, [courseId]);

  // Real-time chat subscription
  useEffect(() => {
    if (!courseId) return;
    const channel = supabase
      .channel(`course-chat-${courseId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "course_messages", filter: `course_id=eq.${courseId}` },
        async (payload) => {
          const { data } = await supabase
            .from("course_messages")
            .select("*, profiles(name)")
            .eq("id", payload.new.id)
            .single();
          if (data) setMessages(prev => [...prev, data as Message]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [courseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("course_messages")
      .select("*, profiles(name)")
      .eq("course_id", courseId!)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
  };

  const fetchThreads = async () => {
    const { data } = await supabase
      .from("discussion_threads")
      .select("*, profiles(name)")
      .eq("course_id", courseId!)
      .order("created_at", { ascending: false });
    if (data) {
      // Get reply counts
      const threadsWithCounts = await Promise.all(
        data.map(async (thread) => {
          const { count } = await supabase
            .from("thread_replies")
            .select("*", { count: "exact", head: true })
            .eq("thread_id", thread.id);
          return { ...thread, reply_count: count || 0 } as Thread;
        })
      );
      setThreads(threadsWithCounts);
    }
  };

  const fetchReplies = async (threadId: string) => {
    const { data } = await supabase
      .from("thread_replies")
      .select("*, profiles(name)")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });
    if (data) setReplies(data as Reply[]);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sendingMessage) return;
    setSendingMessage(true);
    const { error } = await supabase.from("course_messages").insert({
      course_id: courseId!,
      user_id: userId,
      content: newMessage.trim(),
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setNewMessage("");
    setSendingMessage(false);
  };

  const handleCreateThread = async () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;
    const { error } = await supabase.from("discussion_threads").insert({
      course_id: courseId!,
      user_id: userId,
      title: newThreadTitle.trim(),
      content: newThreadContent.trim(),
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      setNewThreadTitle("");
      setNewThreadContent("");
      setThreadDialogOpen(false);
      fetchThreads();
      toast({ title: "Thread created!" });
    }
  };

  const handleSendReply = async () => {
    if (!newReply.trim() || !selectedThread) return;
    const { error } = await supabase.from("thread_replies").insert({
      thread_id: selectedThread.id,
      user_id: userId,
      content: newReply.trim(),
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      setNewReply("");
      fetchReplies(selectedThread.id);
      fetchThreads();
    }
  };

  const openThread = (thread: Thread) => {
    setSelectedThread(thread);
    fetchReplies(thread.id);
  };

  const getInitials = (name: string) => name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar onSearch={() => {}} />
        <main className="p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/courses")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{courseTitle}</h1>
              <p className="text-muted-foreground text-sm">Discussion & Chat</p>
            </div>
          </div>

          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="chat" className="gap-2">
                <MessageSquare className="h-4 w-4" /> Live Chat
              </TabsTrigger>
              <TabsTrigger value="forum" className="gap-2">
                <MessageCircle className="h-4 w-4" /> Forum
              </TabsTrigger>
            </TabsList>

            {/* LIVE CHAT TAB */}
            <TabsContent value="chat">
              <Card className="h-[calc(100vh-280px)] flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Course Chat</CardTitle>
                  <CardDescription>Real-time discussion with fellow learners</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden p-4 pt-0">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-3">
                      {messages.length === 0 && (
                        <p className="text-center text-muted-foreground py-12">No messages yet. Start the conversation!</p>
                      )}
                      {messages.map((msg) => {
                        const isOwn = msg.user_id === userId;
                        return (
                          <div key={msg.id} className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {getInitials(msg.profiles?.name || "")}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`max-w-[70%] ${isOwn ? "items-end" : ""}`}>
                              <p className={`text-xs text-muted-foreground mb-1 ${isOwn ? "text-right" : ""}`}>
                                {msg.profiles?.name || "Unknown"} · {format(new Date(msg.created_at), "h:mm a")}
                              </p>
                              <div className={`rounded-2xl px-3 py-2 text-sm ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                                {msg.content}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                      maxLength={500}
                    />
                    <Button onClick={handleSendMessage} disabled={sendingMessage || !newMessage.trim()} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FORUM TAB */}
            <TabsContent value="forum">
              {selectedThread ? (
                <Card className="h-[calc(100vh-280px)] flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedThread(null); setReplies([]); }}>
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{selectedThread.title}</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" /> {selectedThread.profiles?.name}
                      <Clock className="h-3 w-3 ml-2" /> {format(new Date(selectedThread.created_at), "MMM d, yyyy")}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{selectedThread.content}</p>
                    <Separator />
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col overflow-hidden p-4 pt-0">
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-4">
                        {replies.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">No replies yet. Be the first!</p>
                        )}
                        {replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="text-xs bg-accent text-accent-foreground">
                                {getInitials(reply.profiles?.name || "")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{reply.profiles?.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(reply.created_at), "MMM d, h:mm a")}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <Input
                        placeholder="Write a reply..."
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendReply()}
                        maxLength={1000}
                      />
                      <Button onClick={handleSendReply} disabled={!newReply.trim()} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Discussion Threads</h2>
                    <Dialog open={threadDialogOpen} onOpenChange={setThreadDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-1">
                          <Plus className="h-4 w-4" /> New Thread
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create Discussion Thread</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="Thread title"
                            value={newThreadTitle}
                            onChange={(e) => setNewThreadTitle(e.target.value)}
                            maxLength={200}
                          />
                          <Textarea
                            placeholder="Describe your topic or question..."
                            value={newThreadContent}
                            onChange={(e) => setNewThreadContent(e.target.value)}
                            maxLength={2000}
                            rows={4}
                          />
                          <Button onClick={handleCreateThread} disabled={!newThreadTitle.trim() || !newThreadContent.trim()} className="w-full">
                            Create Thread
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {threads.length === 0 ? (
                    <Card className="p-12 text-center">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No discussion threads yet. Start one!</p>
                    </Card>
                  ) : (
                    <div className="space-y-2">
                      {threads.map((thread) => (
                        <Card
                          key={thread.id}
                          className="cursor-pointer hover:shadow-soft transition-all"
                          onClick={() => openThread(thread)}
                        >
                          <CardContent className="p-4 flex items-start gap-3">
                            <Avatar className="h-9 w-9 shrink-0 mt-0.5">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {getInitials(thread.profiles?.name || "")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm line-clamp-1">{thread.title}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{thread.content}</p>
                              <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                                <span>{thread.profiles?.name}</span>
                                <span>{format(new Date(thread.created_at), "MMM d")}</span>
                                <Badge variant="secondary" className="text-xs h-5">
                                  <MessageSquare className="h-3 w-3 mr-1" /> {thread.reply_count}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default CourseDiscussion;
