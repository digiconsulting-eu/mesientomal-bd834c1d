import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://igulwzwituvozwneguky.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlndWx3endpdHV2b3p3bmVndWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMzEwMzQsImV4cCI6MjA1MTkwNzAzNH0.dgmg0NtpfbcZm4SoS2rbEiWKC4PpgqkNghTdsqZCavA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);