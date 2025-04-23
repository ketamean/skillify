import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabasePrivateKey = process.env.SUPABASE_PRIVATE_KEY || '';

export default createClient(supabaseUrl, supabasePrivateKey);