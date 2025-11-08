import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN!;
const BUCKET = process.env.AWS_S3_BUCKET!;

export async function uploadMovieCover(file: Express.Multer.File): Promise<string> {
  const ext = file.originalname.split(".").pop() || "jpg";
  const key = `movies/covers/${randomUUID()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: "public-read" --- desativado em modo desenvolvimento
    })
  );

  if (CLOUDFRONT_DOMAIN) {
    return `https://${CLOUDFRONT_DOMAIN}/${key}`;
  }

  return `https://${BUCKET}.s3.amazonaws.com/${key}`;
}
