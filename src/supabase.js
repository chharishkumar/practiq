import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://soedhhpzkllgtjtnpkrk.supabase.co";
const supabaseKey = "sb_publishable_WOHFh44GdXyuTP2Rvaf-ag_WE2AQCIt";

export const supabase = createClient(supabaseUrl, supabaseKey);