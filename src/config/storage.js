const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = 'soca-bucket';
const bucket = storage.bucket(bucketName);

module.exports = bucket;