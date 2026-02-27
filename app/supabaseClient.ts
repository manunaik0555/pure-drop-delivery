import { createClient } from '@supabase/supabase-js'

const supabaseUrl ='https://tccvgjxkkxdvotzpnfkc.supabase.co'
const supabaseAnonKey = 'sb_publishable_Y7yuafFowqz4v1v8X_W-Hg_7BBKcayr'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)