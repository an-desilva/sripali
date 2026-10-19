import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const region = process.env.AWS_REGION || 'us-east-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || 'mock_access_key';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || 'mock_secret_key';

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const bucketName = process.env.AWS_S3_BUCKET_NAME || 'sripalie-prescriptions-bucket';

export const generatePresignedUploadUrl = async (fileName: string, fileType: string) => {
  const key = `uploads/${Date.now()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

  return { uploadUrl: url, fileUrl, key };
};
