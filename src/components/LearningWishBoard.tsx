import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Sparkles, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Wish {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: { name: string } | null;
}

export const LearningWishBoard = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      fetchWishes();
    };
    init();

    const channel = supabase
      .channel("learning-wishes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "learning_wishes" },
        () => fetchWishes()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [wishes]);

  const fetchWishes = async () => {
    const { data, error } = await supabase
      .from("learning_wishes")
      .select("*, profiles:user_id(name)")
      .order("created_at", { ascending: true })
      .limit(100);

    if (!error && data) {
      setWishes(data as unknown as Wish[]);
    }
  };

  const handleSend = async () => {
    if (!newWish.trim() || !userId) return;
    if (newWish.trim().length > 500) {
      toast({ title: "Too long", description: "Keep your wish under 500 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("learning_wishes")
      .insert({ content: newWish.trim(), user_id: userId });

    if (error) {
      toast({ title: "Error", description: "Could not post your wish.", variant: "destructive" });
    } else {
      setNewWish("");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("learning_wishes").delete().eq("id", id);
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) +
      " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Learning Wish Board
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tell us what you want to learn! Chat with everyone here 💬
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <ScrollArea className="h-64 pr-3" ref={scrollRef as any}>
          <div className="space-y-3">
            {wishes.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">
                No wishes yet — be the first to share what you want to learn! ✨
              </p>
            )}
            {wishes.map((wish) => {
              const name = wish.profiles?.name || "Anonymous";
              const isOwn = wish.user_id === userId;
              return (
                <div key={wish.id} className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[75%] ${isOwn ? "text-right" : ""}`}>
                    <div className={`rounded-2xl px-3 py-2 text-sm ${
                      isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      <p className="font-medium text-xs opacity-80 mb-0.5">{name}</p>
                      <p>{wish.content}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{formatTime(wish.created_at)}</span>
                      {isOwn && (
                        <button onClick={() => handleDelete(wish.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            placeholder="I want to learn about..."
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            maxLength={500}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={loading || !newWish.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
