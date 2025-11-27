import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import Papa from "papaparse";

interface CSVUploadData {
  Student_id: string;
  Grade: string;
  Year: string | number;
  Semester: string | number;
  Age: string | number;
  Gender: string;
  Attendance_rate: string | number;
  Gpa: string | number;
  Assignments_completed: string | number;
  Behavior_incidents: string | number;
  Parent_engagement: string;
  Socioeconomic_status: string;
  Fee_balance: string | number;
  Mental_health_flag: string;
}

export function CSVUploader({ onUploadComplete, userId }: { onUploadComplete: () => void; userId: string }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      Papa.parse<CSVUploadData>(file, {
        header: true,
        complete: async (results) => {
          const data = results.data
            .filter(row => row.Student_id && row.Grade && row.Attendance_rate && row.Gpa)
            .map(row => {
              const mappedRow: any = {
                user_id: userId,
                Student_id: row.Student_id,
                Grade: row.Grade,
                Year: row.Year ? parseInt(row.Year.toString(), 10) : null,
                Semester: row.Semester ? parseInt(row.Semester.toString(), 10) : null,
                Age: row.Age ? parseInt(row.Age.toString(), 10) : null,
                Gender: row.Gender,
                Attendance_rate: parseFloat(row.Attendance_rate.toString()) / 100,
                Gpa: parseFloat(row.Gpa.toString()),
                Assignments_completed: row.Assignments_completed ? parseInt(row.Assignments_completed.toString(), 10) : null,
                Behavior_incidents: row.Behavior_incidents ? parseInt(row.Behavior_incidents.toString(), 10) : null,
                Parent_engagement: row.Parent_engagement,
                Socioeconomic_status: row.Socioeconomic_status,
                Fee_balance: row.Fee_balance ? parseFloat(row.Fee_balance.toString()) : null,
                Mental_health_flag: row.Mental_health_flag
              };
              
              return mappedRow;
            });

          if (data.length === 0) {
            toast({
              title: "Error",
              description: "No valid data found in CSV",
              variant: "destructive"
            });
            setIsUploading(false);
            return;
          }

          const { error } = await supabase
            .from('students')
            .insert(data);

          if (error) {
            console.error('Upload error:', error);
            toast({
              title: "Upload Failed",
              description: error.message,
              variant: "destructive"
            });
          } else {
            toast({
              title: "Success",
              description: `Uploaded ${data.length} students successfully`
            });
            onUploadComplete();
          }

          setIsUploading(false);
          event.target.value = '';
        },
        error: (error) => {
          console.error('Parse error:', error);
          toast({
            title: "Parse Error",
            description: "Failed to parse CSV file",
            variant: "destructive"
          });
          setIsUploading(false);
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload CSV",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <Upload className="w-5 h-5 text-muted-foreground" />
        <div className="flex-1">
          <h3 className="font-semibold">Upload Student Data</h3>
          <p className="text-sm text-muted-foreground">CSV with Student_id, Grade, Year, Semester, Age, Gender, Attendance_rate, Gpa, Assignments_completed, Behavior_incidents, Parent_engagement, Socioeconomic_status, Fee_balance, Mental_health_flag</p>
        </div>
        <Button asChild disabled={isUploading}>
          <label className="cursor-pointer">
            {isUploading ? 'Uploading...' : 'Choose File'}
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </Button>
      </div>
    </Card>
  );
}
