import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dpcisqeugzvbqfmcrhzw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwY2lzcWV1Z3p2YnFmbWNyaHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NzEyODIsImV4cCI6MjA3OTQ0NzI4Mn0.8yXQS5cLfXthiKX61i0XZDSJcnqH5wi2PVySD9dM5HE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
