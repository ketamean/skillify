import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://qlgqwskmctxlhulicvrw.supabase.co'
const supabaseKey = process.env.SUPABASE_PRIVATE_KEY || "0"//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZ3F3c2ttY3R4bGh1bGljdnJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NTI4ODQsImV4cCI6MjA1NjQyODg4NH0.Gkoga1cWgxHzq2fdQEJFVyPv1wsotBxaWjYkg7xwTsA"
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;