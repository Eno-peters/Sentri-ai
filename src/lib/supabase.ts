import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://haqdeughslojktzvnfgr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhcWRldWdoc2xvamt0enZuZmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMDc5NzMsImV4cCI6MjA3OTU4Mzk3M30.DAwcVqPNSHl85oxO7OJO0ol33NREDpNmCTItx_gtixY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Student {
  Student_id: string;
  Grade: string;
  Attendance_rate: number;
  Gpa: number;
  risk_prediction: 'High' | 'Low' | null;
  risk_reason: string | null;
  user_id: string;
}
