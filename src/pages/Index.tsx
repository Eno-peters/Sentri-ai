import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, Student } from "@/lib/supabase";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CSVUploader } from "@/components/dashboard/CSVUploader";
import { StudentsTable } from "@/components/dashboard/StudentsTable";
import { Button } from "@/components/ui/button";
import { Users, AlertTriangle, RefreshCw, Trash2, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const STUDENTS_PER_PAGE = 20;

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [atRiskCount, setAtRiskCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchStudents = async (page: number) => {
    setIsLoading(true);
    try {
      const from = (page - 1) * STUDENTS_PER_PAGE;
      const to = from + STUDENTS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('students')
        .select('*', { count: 'exact' })
        .order('Student_id', { ascending: true })
        .range(from, to);

      if (error) throw error;

      setStudents(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { count: highRiskCount, error } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('risk_prediction', 'High');

      if (error) throw error;
      setAtRiskCount(highRiskCount || 0);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchStudents(currentPage);
      fetchStats();
    }
  }, [currentPage, session]);

  const handleRefresh = () => {
    fetchStudents(currentPage);
    fetchStats();
    toast({
      title: "Refreshed",
      description: "Data has been reloaded"
    });
  };

  const handleUploadComplete = () => {
    fetchStudents(1);
    fetchStats();
    setCurrentPage(1);
  };

  const handleClearData = async () => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .neq('Student_id', ''); // Delete all records

      if (error) throw error;

      toast({
        title: "Success",
        description: "All student data has been cleared"
      });

      fetchStudents(1);
      fetchStats();
      setCurrentPage(1);
    } catch (error) {
      console.error('Error clearing data:', error);
      toast({
        title: "Error",
        description: "Failed to clear data",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
  };

  const totalPages = Math.ceil(totalCount / STUDENTS_PER_PAGE);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Student Dropout Prediction</h1>
            <p className="text-muted-foreground mt-2">Monitor and analyze student risk factors</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                  Clear Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Student Data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {totalCount} student records from the database. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <StatsCard
            title="Total Students"
            value={totalCount}
            icon={Users}
            iconColor="text-primary"
          />
          <StatsCard
            title="At Risk Students"
            value={atRiskCount}
            icon={AlertTriangle}
            iconColor="text-destructive"
          />
        </div>

        {/* CSV Upload */}
        <CSVUploader onUploadComplete={handleUploadComplete} userId={session.user.id} />

        {/* Students Table */}
        <StudentsTable
          students={students}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Index;
