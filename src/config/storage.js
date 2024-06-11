const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = process.env.BUCKET_NAME || "soca-app";
const bucket = storage.bucket(bucketName);

module.exports = bucket;