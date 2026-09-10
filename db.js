// =============================================
// db.js - Funções de banco de dados (Supabase)
// =============================================

const DB = {
  // Buscar todas as seções
  async getAll() {
    if (!supabase) {
      console.warn('Supabase não inicializado, fallback local');
      return null;
    }
    const { data, error } = await supabase
      .from('site_config')
      .select('section, data');

    if (error) {
      console.error('Erro ao buscar dados:', error);
      return null;
    }

    const config = {};
    data.forEach(row => {
      config[row.section] = row.data;
    });
    return config;
  },

  // Buscar uma seção específica
  async getSection(section) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('site_config')
      .select('data')
      .eq('section', section)
      .single();

    if (error) {
      console.error(`Erro ao buscar seção ${section}:`, error);
      return null;
    }
    return data?.data;
  },

  // Salvar/atualizar uma seção
  async saveSection(section, data) {
    if (!supabase) {
      console.warn('Supabase não inicializado, não foi possível salvar');
      return false;
    }
    const { error } = await supabase
      .from('site_config')
      .upsert(
        { section, data, updated_at: new Date().toISOString() },
        { onConflict: 'section' }
      );

    if (error) {
      console.error(`Erro ao salvar seção ${section}:`, error);
      return false;
    }
    return true;
  },

  // Salvar todas as seções de uma vez
  async saveAll(config) {
    if (!supabase) {
      console.warn('Supabase não inicializado, não foi possível salvar');
      return false;
    }
    const rows = Object.entries(config).map(([section, data]) => ({
      section,
      data,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('site_config')
      .upsert(rows, { onConflict: 'section' });

    if (error) {
      console.error('Erro ao salvar tudo:', error);
      return false;
    }
    return true;
  },

  // Login
  async login(email, password) {
    if (!supabase) return { user: null, error: 'Supabase não inicializado' };
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Erro no login:', error);
      return { user: null, error: error.message };
    }
    return { user: data.user, error: null };
  },

  // Logout
  async logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
  },

  // Verificar sessão atual
  async getSession() {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Listener de mudança de auth
  onAuthChange(callback) {
    if (!supabase) return;
    supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },

  // Verificar se usuário é SUPER_ADMIN (via RPC is_super_admin)
  async isSuperAdmin() {
    if (!supabase) return false;
    try {
      const { data, error } = await supabase.rpc('is_super_admin');
      if (!error && typeof data === 'boolean') return data;
      if (error) console.warn('is_super_admin rpc falhou, fallback para users:', error.message);
    } catch (e) {
      console.warn('is_super_admin exception:', e);
    }
    // Fallback direto na tabela users
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data: profile, error } = await supabase.from('users').select('role').eq('id', user.id).single();
      if (error) {
        console.warn('Fallback users role falhou:', error.message);
        return false;
      }
      return profile?.role === 'SUPER_ADMIN';
    } catch (e) {
      console.warn('Fallback exception:', e);
      return false;
    }
  },

  // Buscar role do usuário logado
  async getUserRole() {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (error) return null;
    return data?.role || null;
  }
};
