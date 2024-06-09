const multer = require('multer');

const upload = multer({
    limits: { fileSize: 5000000 }, // 5MB
    storage: multer.memoryStorage()
  });

module.exports = upload;