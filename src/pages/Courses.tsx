import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Users, Clock } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  created_at: string;
  profiles: { name: string };
}

interface Enrollment {
  course_id: string;
  progress: number;
  completion_status: string;
}

const Courses = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUserId(user.id);

      // Fetch courses with instructor info
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*, profiles(name)")
        .order("created_at", { ascending: false });

      if (coursesError) throw coursesError;

      // Fetch user's enrollments
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id);

      if (enrollmentsError) throw enrollmentsError;

      setCourses(coursesData || []);
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

  const handleEnroll = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from("enrollments")
        .insert({ user_id: userId, course_id: courseId });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Enrolled in course successfully.",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some((e) => e.course_id === courseId);
  };

  const getEnrollmentProgress = (courseId: string) => {
    const enrollment = enrollments.find((e) => e.course_id === courseId);
    return enrollment?.progress || 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar onSearch={() => {}} />
        
        <main className="p-4 md:p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              Available Courses
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse and enroll in courses to start learning
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading courses...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-elevated transition-all">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Instructor: {course.profiles?.name || "Unknown"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {course.description}
                    </p>
                    
                    {isEnrolled(course.id) ? (
                      <div className="space-y-2">
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Progress: {getEnrollmentProgress(course.id).toFixed(0)}%
                        </Badge>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full transition-all"
                            style={{ width: `${getEnrollmentProgress(course.id)}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleEnroll(course.id)}
                        className="w-full"
                      >
                        Enroll Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && courses.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No courses available yet.</p>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Courses;
