const { v4: uuid } = require('uuid');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const uploadFile = async (file) => {
    const client = new S3Client({
        forcePathStyle: true,
        region: process.env.SUPABASE_REGION,
        endpoint: process.env.SUPABASE_URL,
        credentials: {
            accessKeyId: process.env.SUPABASE_ACCESS_KEY,
            secretAccessKey: process.env.SUPABASE_SECRET_KEY
        }
    })

    const fileKey = uuid() + '_' + file.originalname;

    const uploadCommand = new PutObjectCommand({
        Bucket: 'predictions',
        Key: fileKey,
        Body: file.buffer,
        ContentType: 'image/jpeg',
      })
      
    await client.send(uploadCommand)

    const baseUrl = process.env.SUPABASE_URL.replace('s3', 'object/public/predictions/');
    const imageUrl = `${baseUrl}${fileKey}`;
    return imageUrl;
}

module.exports = { uploadFile };