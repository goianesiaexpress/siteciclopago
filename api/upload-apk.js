import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verifica auth via Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://kgdobzyphonczgpjrlnc.supabase.co';
  const anonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZG9ienlwaG9uY3pncGpybG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NDE2MTUsImV4cCI6MjA5NzIxNzYxNX0.pKh9OGfMF737BQjvlIQFF9LbxmtrgxmOFRrwL5fxqEk';
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    return res.status(500).json({ error: 'Service key não configurada' });
  }

  // Valida usuário e se é SUPER_ADMIN
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } }
  });
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) {
    return res.status(401).json({ error: 'Sessão inválida' });
  }
  const { data: isSuper, error: rpcErr } = await userClient.rpc('is_super_admin');
  let isSuperAdmin = false;
  if (!rpcErr && typeof isSuper === 'boolean') isSuperAdmin = isSuper;
  else {
    const { data: profile } = await userClient.from('users').select('role').eq('id', user.id).single();
    isSuperAdmin = profile?.role === 'SUPER_ADMIN';
  }
  if (!isSuperAdmin) {
    return res.status(403).json({ error: 'Apenas SUPER_ADMIN pode enviar APK' });
  }

  // Lê o body como buffer (multipart)
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);
  
  // Tenta extrair boundary e arquivo do multipart
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    return res.status(400).json({ error: 'Envie como multipart/form-data com campo file' });
  }

  // Usa busboy-like parsing simples via supabase storage diretamente com buffer
  // Para simplificar, espera que o frontend envie o arquivo raw com header x-file-name
  const fileName = req.headers['x-file-name'] || 'ciclopago.apk';
  if (!fileName.endsWith('.apk')) {
    return res.status(400).json({ error: 'Arquivo deve ser .apk' });
  }
  if (buffer.length > 100 * 1024 * 1024) {
    return res.status(400).json({ error: 'Arquivo muito grande (máx 100MB)' });
  }

  const serviceClient = createClient(supabaseUrl, serviceKey);
  const { error: uploadErr } = await serviceClient.storage.from('apk').upload('ciclopago.apk', buffer, {
    upsert: true,
    contentType: 'application/vnd.android.package-archive',
    cacheControl: '3600'
  });
  if (uploadErr) {
    return res.status(500).json({ error: uploadErr.message });
  }

  const { data } = serviceClient.storage.from('apk').getPublicUrl('ciclopago.apk');
  return res.status(200).json({ url: data.publicUrl + '?download=', path: 'apk/ciclopago.apk' });
}
