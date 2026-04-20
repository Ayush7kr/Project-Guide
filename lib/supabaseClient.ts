import { createClient } from '@supabase/supabase-js';

// Configuration with provided credentials
const supabaseUrl = 'https://yorulqxwupapjqyxtdmt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvcnVscXh3dXBhcGpxeXh0ZG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MzIzMjksImV4cCI6MjA4MzEwODMyOX0.AR-5O8dnnliKvgTBE1AFcqcPK_YBW9Mt2CC772feHmo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);