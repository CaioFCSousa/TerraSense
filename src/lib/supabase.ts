import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Analysis {
  id: string;
  created_at: string;
  image_url: string;
  soil_type: string;
  characteristics: string[];
  recommendations: string[];
  location?: string;
}
