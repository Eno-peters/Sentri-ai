import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Student } from "@/lib/supabase";
import { RiskBadge } from "./RiskBadge";

interface StudentsTableProps {
  students: Student[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function StudentsTable({
  students,
  currentPage,
  totalPages,
  onPageChange,
  isLoading
}: StudentsTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold">Student ID</TableHead>
              <TableHead className="font-bold">Grade</TableHead>
              <TableHead className="font-bold">Attendance Rate</TableHead>
              <TableHead className="font-bold">GPA</TableHead>
              <TableHead className="font-bold">Risk Status</TableHead>
              <TableHead className="font-bold">Risk Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading students...
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.Student_id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{student.Student_id}</TableCell>
                  <TableCell>{student.Grade}</TableCell>
                  <TableCell>
                    {student.Attendance_rate > 1 
                      ? student.Attendance_rate.toFixed(1) 
                      : (student.Attendance_rate * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell>{student.Gpa.toFixed(2)}</TableCell>
                  <TableCell>
                    <RiskBadge risk={student.risk_prediction} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {student.risk_reason || '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
