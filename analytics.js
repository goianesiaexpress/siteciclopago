// =============================================
// analytics.js - Rastreamento total + online realtime
// Usa Supabase (site_visits + online_presence + Realtime Presence)
// =============================================

const Analytics = (() => {
  let sessionId = null;
  let channel = null;
  let heartbeat = null;
  let totalCache = null;

  function getSessionId() {
    if (sessionId) return sessionId;
    let sid = localStorage.getItem('analytics_session');
    if (!sid) {
      sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
      localStorage.setItem('analytics_session', sid);
    }
    sessionId = sid;
    return sid;
  }

  async function ensureSupabase() {
    // Aguarda supabaseClient estar pronto (supabase.js)
    for (let i = 0; i < 50; i++) {
      if (typeof supabaseClient !== 'undefined' && supabaseClient) return supabaseClient;
      if (typeof window.supabaseClient !== 'undefined' && window.supabaseClient) return window.supabaseClient;
      if (typeof supabase !== 'undefined' && supabase && supabase.from) return supabase;
      await new Promise(r => setTimeout(r, 100));
    }
    console.warn('Analytics: supabaseClient não disponível');
    return null;
  }

  async function trackVisit() {
    const sb = await ensureSupabase();
    if (!sb) return;
    const sid = getSessionId();
    const path = location.pathname || '/';
    // Evita contar reloads na mesma sessão em < 30min como nova visita? Conta sempre, mas session controla online
    const lastVisit = sessionStorage.getItem('analytics_visit_sent');
    if (lastVisit) return; // já contou nesta sessão de aba
    sessionStorage.setItem('analytics_visit_sent', '1');

    try {
      const { error } = await sb.from('site_visits').insert({
        session_id: sid,
        path: path,
        user_agent: navigator.userAgent,
      });
      if (error) console.warn('Analytics visit falhou (tabela ainda não criada?):', error.message);
      else console.log('Analytics: visita registrada', sid);
    } catch (e) {
      console.warn('Analytics trackVisit erro:', e);
    }
  }

  async function heartbeatOnline() {
    const sb = await ensureSupabase();
    if (!sb) return;
    const sid = getSessionId();
    try {
      const { error } = await sb.from('online_presence').upsert({
        session_id: sid,
        path: location.pathname || '/',
        user_agent: navigator.userAgent,
        last_seen: new Date().toISOString()
      }, { onConflict: 'session_id' });
      if (error) console.warn('Analytics heartbeat falhou:', error.message);
    } catch (e) {
      console.warn('heartbeat erro', e);
    }
  }

  async function setupRealtimePresence() {
    const sb = await ensureSupabase();
    if (!sb) return;
    const sid = getSessionId();
    try {
      channel = sb.channel('online-users', {
        config: { presence: { key: sid } }
      });
      channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        updateOnlineUI(count);
        // Também atualiza via DB para quem não usa Realtime
      });
      channel.on('presence', { event: 'join' }, () => updateOnlineUI(Object.keys(channel.presenceState()).length));
      channel.on('presence', { event: 'leave' }, () => updateOnlineUI(Object.keys(channel.presenceState()).length));
      await channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString(), path: location.pathname });
          // Força atualização inicial via DB também
          fetchOnlineCount();
        }
      });
    } catch (e) {
      console.warn('Realtime presence falhou, fallback para polling:', e);
    }
  }

  function updateOnlineUI(count) {
    // Atualiza elementos com data-analytics-online
    document.querySelectorAll('[data-analytics-online]').forEach(el => el.textContent = count);
    // Evento global
    window.dispatchEvent(new CustomEvent('analytics:online', { detail: { count } }));
  }

  function updateTotalUI(total) {
    document.querySelectorAll('[data-analytics-total]').forEach(el => el.textContent = total.toLocaleString('pt-BR'));
    window.dispatchEvent(new CustomEvent('analytics:total', { detail: { total } }));
  }

  async function fetchTotal() {
    const sb = await ensureSupabase();
    if (!sb) return null;
    try {
      // Tenta via RPC, fallback para count
      let { data, error } = await sb.rpc('get_total_visits');
      if (!error && typeof data === 'number') {
        totalCache = data;
        updateTotalUI(data);
        return data;
      }
      // Fallback: count head
      const { count, error: cErr } = await sb.from('site_visits').select('*', { count: 'exact', head: true });
      if (!cErr && typeof count === 'number') {
        totalCache = count;
        updateTotalUI(count);
        return count;
      }
      if (cErr) console.warn('fetchTotal falhou:', cErr.message);
    } catch (e) { console.warn('fetchTotal erro', e); }
    return null;
  }

  async function fetchOnlineCount() {
    const sb = await ensureSupabase();
    if (!sb) return null;
    try {
      let { data, error } = await sb.rpc('get_online_count');
      if (!error && typeof data === 'number') {
        updateOnlineUI(data);
        return data;
      }
      const { count, error: cErr } = await sb.from('online_presence').select('*', { count: 'exact', head: true }).gt('last_seen', new Date(Date.now() - 2 * 60 * 1000).toISOString());
      if (!cErr && typeof count === 'number') {
        updateOnlineUI(count);
        return count;
      }
    } catch (e) { console.warn('fetchOnlineCount erro', e); }
    return null;
  }

  async function init() {
    // Não rastreia bot/preview do Vercel
    if (navigator.userAgent.includes('vercel-screenshot')) return;
    getSessionId();
    await trackVisit();
    await heartbeatOnline();
    heartbeat = setInterval(heartbeatOnline, 30 * 1000);
    // Fecha presença ao sair
    window.addEventListener('beforeunload', () => {
      if (channel) channel.untrack();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') heartbeatOnline();
    });
    setupRealtimePresence();
    // Polling fallback para online/total a cada 30s
    fetchTotal();
    fetchOnlineCount();
    setInterval(() => { fetchOnlineCount(); fetchTotal(); }, 30 * 1000);
  }

  // Auto-init quando DOM pronto e supabase carregado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Espera um pouco para supabase.js carregar
    setTimeout(init, 800);
  }

  return { init, fetchTotal, fetchOnlineCount, getSessionId, trackVisit };
})();
