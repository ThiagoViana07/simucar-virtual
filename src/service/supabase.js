import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabaseURL = 'https://jxhqivcyhmgjwhsuedjn.supabase.co'
const suapaBaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aHFpdmN5aG1nandoc3VlZGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NjQwMjEsImV4cCI6MjA1NjQ0MDAyMX0.VeEGVN2Iq2XKOoDxSz6N2ZH_A63jP0X47ebsExLuljw'


export const supabase = createClient(
  supabaseURL,
  suapaBaseAnonKey
);


