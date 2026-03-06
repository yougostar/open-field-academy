import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Video, VideoOff, Plus, Users, Clock, Radio } from "lucide-react";

interface LiveSession {
  id: string;
  title: string;
  subject: string;
  description: string;
  room_id: string;
  created_by: string;
  is_active: boolean;
  started_at: string | null;
  created_at: string;
}

const LiveClass = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);

  const subjects = ["Maths", "Science", "Social Science", "Hindi", "English"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const [rolesRes, sessionsRes] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id),
        supabase.from("live_sessions").select("*").order("created_at", { ascending: false }),
      ]);

      if (rolesRes.data) setUserRoles(rolesRes.data.map((r: any) => r.role));
      if (sessionsRes.data) setSessions(sessionsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isTeacher = userRoles.includes("instructor") || userRoles.includes("admin");

  const createSession = async () => {
    if (!newTitle || !newSubject || !userId) return;
    const roomId = `aarambh-${newSubject.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

    const { error } = await supabase.from("live_sessions").insert({
      title: newTitle,
      subject: newSubject,
      description: newDescription,
      room_id: roomId,
      created_by: userId,
      is_active: true,
      started_at: new Date().toISOString(),
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Session created!", description: "Students can now join." });
      setCreateOpen(false);
      setNewTitle("");
      setNewSubject("");
      setNewDescription("");
      fetchData();
      joinRoom(roomId);
    }
  };

  const toggleSession = async (session: LiveSession) => {
    const newActive = !session.is_active;
    const updates: any = { is_active: newActive };
    if (!newActive) updates.ended_at = new Date().toISOString();

    await supabase.from("live_sessions").update(updates).eq("id", session.id);
    fetchData();
    if (!newActive && activeRoom === session.room_id) {
      leaveRoom();
    }
  };

  const joinRoom = (roomId: string) => {
    setActiveRoom(roomId);
    // Jitsi will be loaded via useEffect
  };

  const leaveRoom = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }
    setActiveRoom(null);
  };

  useEffect(() => {
    if (!activeRoom || !jitsiContainerRef.current) return;

    const loadJitsi = () => {
      if ((window as any).JitsiMeetExternalAPI) {
        initJitsi();
      } else {
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = initJitsi;
        document.head.appendChild(script);
      }
    };

    const initJitsi = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from("profiles").select("name").eq("id", user?.id).single();

      const api = new (window as any).JitsiMeetExternalAPI("meet.jit.si", {
        roomName: activeRoom,
        parentNode: jitsiContainerRef.current,
        width: "100%",
        height: "100%",
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          toolbarButtons: [
            "microphone", "camera", "desktop", "chat", "raisehand",
            "participants-pane", "tileview", "fullscreen", "hangup",
            "recording", "settings", "filmstrip",
          ],
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_ALWAYS_VISIBLE: true,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
        },
        userInfo: {
          displayName: profile?.name || "Student",
        },
      });

      api.addEventListener("readyToClose", () => {
        leaveRoom();
      });

      jitsiApiRef.current = api;
    };

    loadJitsi();

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [activeRoom]);

  const activeSessions = sessions.filter((s) => s.is_active);
  const pastSessions = sessions.filter((s) => !s.is_active);

  if (activeRoom) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 md:ml-64 flex flex-col">
          <div className="p-3 bg-card border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="font-semibold text-sm text-foreground">Live Session</span>
            </div>
            <Button variant="destructive" size="sm" onClick={leaveRoom}>
              <VideoOff className="h-4 w-4 mr-2" />Leave
            </Button>
          </div>
          <div ref={jitsiContainerRef} className="flex-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Topbar onSearch={() => {}} />
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Live Classes</h1>
              <p className="text-muted-foreground mt-1">Join live sessions with your teachers</p>
            </div>
            {isTeacher && (
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />Start Live Class
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Start a Live Class</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <Input placeholder="Session title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                    <Select value={newSubject} onValueChange={setNewSubject}>
                      <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea placeholder="Description (optional)" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                    <Button className="w-full" onClick={createSession} disabled={!newTitle || !newSubject}>
                      <Video className="h-4 w-4 mr-2" />Go Live
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Active Sessions */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <Radio className="h-5 w-5 text-red-500 animate-pulse" />
              Live Now
            </h2>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : activeSessions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <VideoOff className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No live sessions right now. Check back later!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeSessions.map((session) => (
                  <Card key={session.id} className="border-red-500/30 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                      </div>
                      <Badge variant="secondary" className="w-fit">{session.subject}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {session.description && (
                        <p className="text-sm text-muted-foreground">{session.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Started {session.started_at ? new Date(session.started_at).toLocaleTimeString() : "recently"}
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => joinRoom(session.room_id)}>
                          <Video className="h-4 w-4 mr-2" />Join Class
                        </Button>
                        {isTeacher && session.created_by === userId && (
                          <Button variant="outline" size="sm" onClick={() => toggleSession(session)}>
                            End
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Past Sessions */}
          {pastSessions.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                Past Sessions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastSessions.slice(0, 6).map((session) => (
                  <Card key={session.id} className="opacity-75">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                      <Badge variant="outline" className="w-fit">{session.subject}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.created_at).toLocaleDateString()} • Ended
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default LiveClass;
