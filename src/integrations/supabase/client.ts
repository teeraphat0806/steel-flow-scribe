// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vgoabklanjzdfbpnmshs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnb2Fia2xhbmp6ZGZicG5tc2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3Njg2NzcsImV4cCI6MjA2NzM0NDY3N30.23r5YPj9Ha6CqsCj9uX-NDJtQy5QdxPQxqzOBBvZ8lQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});