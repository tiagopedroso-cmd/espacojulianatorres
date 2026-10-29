import { put } from '@vercel/blob';

export default async function handler(request, response) {
  if (request.method !== 'PUT') return response.status(405).json({ error: 'Método não permitido.' });
  if (!process.env.GALLERY_ADMIN_KEY || request.headers['x-gallery-key'] !== process.env.GALLERY_ADMIN_KEY) {
    return response.status(401).json({ error: 'Acesso não autorizado.' });
  }
  const length = Number(request.headers['content-length'] || 0);
  if (length > 10 * 1024 * 1024) return response.status(413).json({ error: 'Cada imagem deve ter no máximo 10 MB.' });
  if (!String(request.headers['content-type'] || '').startsWith('image/')) return response.status(415).json({ error: 'Envie somente imagens.' });
  const name = String(request.query.filename || 'foto').replace(/[^a-zA-Z0-9._-]/g, '-');
  const blob = await put(`galeria/${Date.now()}-${name}`, request, {
    access: 'public', addRandomSuffix: false, token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return response.status(200).json({ url: blob.url });
}
