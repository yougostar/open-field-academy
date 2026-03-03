import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NoteBookmarkButtonProps {
  noteId: string;
}

export const NoteBookmarkButton = ({ noteId }: NoteBookmarkButtonProps) => {
  const { toast } = useToast();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBookmark();
  }, [noteId]);

  const checkBookmark = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("note_bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("note_id", noteId)
      .maybeSingle();

    setBookmarked(!!data);
  };

  const toggleBookmark = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (bookmarked) {
        await supabase
          .from("note_bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("note_id", noteId);
        setBookmarked(false);
        toast({ title: "Removed from bookmarks" });
      } else {
        await supabase
          .from("note_bookmarks")
          .insert({ user_id: user.id, note_id: noteId });
        setBookmarked(true);
        toast({ title: "Bookmarked! ❤️" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleBookmark}
      disabled={loading}
      className={`transition-all duration-300 ${bookmarked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-400"}`}
    >
      <Heart className={`h-5 w-5 transition-all duration-300 ${bookmarked ? "fill-current scale-110" : "scale-100"}`} />
    </Button>
  );
};
