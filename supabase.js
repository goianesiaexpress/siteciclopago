const SUPABASE_URL = 'https://kgdobzyphonczgpjrlnc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZG9ienlwaG9uY3pncGpybG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NDE2MTUsImV4cCI6MjA5NzIxNzYxNX0.pKh9OGfMF737BQjvlIQFF9LbxmtrgxmOFRrwL5fxqEk';

let supabaseClient = null;
try {
  if (window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.warn('Supabase CDN não carregou, usando fallback local');
  }
} catch (e) {
  console.warn('Erro ao inicializar Supabase:', e);
}
// Compatibilidade: mantém `supabase` como alias para código antigo, mas evita conflito com CDN
if (typeof window !== 'undefined') {
  window.supabaseClient = supabaseClient;
  // Não sobrescreve window.supabase (lib), cria alias seguro
  window.supabaseDB = supabaseClient;
}
// Alias global para db.js (evita ReferenceError se db.js usar `supabase`)
var supabase = supabaseClient;
