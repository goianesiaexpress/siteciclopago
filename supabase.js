const SUPABASE_URL = 'https://kgdobzyphonczgpjrlnc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZG9ienlwaG9uY3pncGpybG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NDE2MTUsImV4cCI6MjA5NzIxNzYxNX0.pKh9OGfMF737BQjvlIQFF9LbxmtrgxmOFRrwL5fxqEk';

const supabaseLib = window.supabase;
let supabaseClient = null;
try {
  if (supabaseLib && supabaseLib.createClient) {
    supabaseClient = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.warn('Supabase CDN não carregou, usando fallback local');
  }
} catch (e) {
  console.warn('Erro ao inicializar Supabase:', e);
}
if (typeof window !== 'undefined') {
  window.supabaseLib = supabaseLib;
  window.supabaseClient = supabaseClient;
  window.supabaseDB = supabaseClient;
}
// Alias global para db.js (evita ReferenceError se db.js usar `supabase`)
var supabase = supabaseClient;
