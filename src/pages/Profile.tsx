import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { User, Mail, BookOpen, Award } from "lucide-react";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (rolesError) throw rolesError;

      // Fetch enrollments with course info
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select("*, courses(title)")
        .eq("user_id", user.id);

      if (enrollmentsError) throw enrollmentsError;

      setProfile(profileData);
      setRoles(rolesData.map((r) => r.role));
      setEnrollments(enrollmentsData || []);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar onSearch={() => {}} />
        
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <User className="h-8 w-8 text-primary" />
                My Profile
              </h1>
              <p className="text-muted-foreground mt-1">
                View and manage your account information
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Profile Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={profile?.name || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input value={profile?.email || ""} disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Roles</Label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        <Award className="h-3 w-3 mr-1" />
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enrolled Courses Card */}
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Courses</CardTitle>
                <CardDescription>Your active learning courses</CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    You haven't enrolled in any courses yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {enrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{enrollment.courses?.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Progress: {enrollment.progress.toFixed(0)}%
                            </p>
                          </div>
                        </div>
                        <Badge variant={enrollment.completion_status === 'completed' ? 'default' : 'secondary'}>
                          {enrollment.completion_status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
