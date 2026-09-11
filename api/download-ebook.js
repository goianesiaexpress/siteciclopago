export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = 'https://kgdobzyphonczgpjrlnc.supabase.co/storage/v1/object/public/manuais/Ciclo_Pago_Guia_de_Gestao_Com_Logos.pdf';

  try {
    const response = await fetch(supabaseUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'PDF não encontrado' });
    }

    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', buffer.byteLength);
    res.setHeader('Content-Disposition', 'attachment; filename="CicloPago_Guia_do_Gestor.pdf"');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    return res.status(200).send(Buffer.from(buffer));
  } catch (e) {
    return res.status(500).json({ error: 'Erro ao buscar PDF' });
  }
}
