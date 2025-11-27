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
  Attendance_rate: number;
  Gpa: number;
}

export function CSVUploader({ onUploadComplete }: { onUploadComplete: () => void }) {
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
            .map(row => ({
              Student_id: row.Student_id,
              Grade: row.Grade,
              Attendance_rate: parseFloat(row.Attendance_rate.toString()),
              Gpa: parseFloat(row.Gpa.toString())
            }));

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
          <p className="text-sm text-muted-foreground">CSV with Student_id, Grade, Attendance_rate, Gpa</p>
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
