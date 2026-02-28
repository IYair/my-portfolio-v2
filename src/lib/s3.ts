import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.SUPABASE_S3_REGION || "us-west-2",
  endpoint: process.env.SUPABASE_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Requerido por la API S3 de Supabase
});

/**
 * Construye la URL pública de Supabase Storage para un objeto dado.
 * Transforma el endpoint S3 en la URL CDN pública:
 * https://xxx.storage.supabase.co/storage/v1/s3
 *   → https://xxx.supabase.co/storage/v1/object/public/{bucket}/{key}
 */
export function getPublicUrl(key: string): string {
  const endpoint = process.env.SUPABASE_S3_ENDPOINT ?? "";
  const bucket = process.env.SUPABASE_S3_BUCKET_NAME ?? "";
  const baseUrl = endpoint.replace(".storage.supabase.co/storage/v1/s3", ".supabase.co");
  return `${baseUrl}/storage/v1/object/public/${bucket}/${key}`;
}

export default s3Client;
