import { useEffect, useState } from "react";
import { supabase, Student } from "@/lib/supabase";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CSVUploader } from "@/components/dashboard/CSVUploader";
import { StudentsTable } from "@/components/dashboard/StudentsTable";
import { Button } from "@/components/ui/button";
import { Users, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const STUDENTS_PER_PAGE = 20;

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [atRiskCount, setAtRiskCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

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
    fetchStudents(currentPage);
    fetchStats();
  }, [currentPage]);

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

  const totalPages = Math.ceil(totalCount / STUDENTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Student Dropout Prediction</h1>
            <p className="text-muted-foreground mt-2">Monitor and analyze student risk factors</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
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
        <CSVUploader onUploadComplete={handleUploadComplete} />

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
