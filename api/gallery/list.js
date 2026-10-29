import { list } from '@vercel/blob';

export default async function handler(_request, response) {
  const { blobs } = await list({ prefix: 'galeria/', token: process.env.BLOB_READ_WRITE_TOKEN });
  return response.status(200).json({ images: blobs.filter(blob => /\.(jpe?g|png|webp|avif)$/i.test(blob.pathname)).map(blob => blob.url) });
}
