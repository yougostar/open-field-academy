import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Radio, X, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActiveSession {
  id: string;
  title: string;
  subject: string;
  room_id: string;
  started_at: string | null;
}

export const LiveClassNotification = () => {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActive = async () => {
      const { data } = await supabase
        .from("live_sessions")
        .select("id, title, subject, room_id, started_at")
        .eq("is_active", true)
        .order("started_at", { ascending: false });
      if (data) setSessions(data);
    };

    fetchActive();
    const interval = setInterval(fetchActive, 15000);
    return () => clearInterval(interval);
  }, []);

  const visible = sessions.filter((s) => !dismissed.has(s.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2 px-4 pt-3">
      {visible.map((session) => (
        <div
          key={session.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 animate-in slide-in-from-top-2"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Radio className="h-4 w-4 text-destructive animate-pulse shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                🔴 Live Now: {session.title}
              </p>
              <p className="text-xs text-muted-foreground">{session.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="destructive"
              className="gap-1.5"
              onClick={() => navigate("/live-class")}
            >
              <Video className="h-3.5 w-3.5" />
              Join
            </Button>
            <button
              onClick={() => setDismissed((prev) => new Set(prev).add(session.id))}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
