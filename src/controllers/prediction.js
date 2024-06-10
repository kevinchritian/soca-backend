const { connection, mssql } = require('../config/database');
const response = require('../Utils/response');
const storage = require('../config/storage');
const tf = require('@tensorflow/tfjs-node');
const bucket = require('../config/storage');
const { v4: uuid } = require('uuid');

const predict = async (req, res) => {
    try {
        const image = req.file;
        if (!image) {
            return response.error(res, 'Image is required');
        }

        const modelUrl = process.env.MODEL_URL;
        const model = await tf.loadGraphModel(modelUrl);
        const inputSize = process.env.INPUT_SIZE;

        const tensor = tf.node
            .decodeJpeg(image.buffer)
            .resizeNearestNeighbor([inputSize, inputSize])
            .expandDims()
            .toFloat();

        const classes = process.env.CLASSES.split(',');

        const prediction = model.predict(tensor);

        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];

        const result = {
            label: label,
            confidenceScore: confidenceScore,
        }

        await saveResult(req, result, image).then((value) => {
            response.success(res, 'Prediction success', value);
        }).catch((error) => {
            throw new Error(error.message);
        });
    } catch (error) {
        response.internalError(res, error.message);
    }
};

const saveResult = async (req, result, image) => {
    try {
        // const imageUrl = await saveImage(req, result, image);
        const conn = await connection();
        const res = await conn.request()
            .input('userId', mssql.Int, req.user.id)
            .input('image', mssql.VarChar, image.originalname)
            // .input('image', mssql.VarChar, imageUrl)
            .input('label', mssql.VarChar, result.label)
            .input('confidenceScore', mssql.Float, result.confidenceScore)
            .input('createdAt', mssql.DateTime, new Date())
            .query('INSERT INTO history (userId, label, confidenceScore, image, createdAt) OUTPUT inserted.* VALUES (@userId, @label, @confidenceScore, @image, @createdAt)');
        
        return res.recordset[0];
    } catch (error) {
        throw new Error(error.message);
    }
};

const saveImage = async (req, result, image) => {
    const blob = bucket.file('predictions/' + uuid() + '-' + image.originalname);
    const blobStream = blob.createWriteStream({ resumable: false });

    blobStream.on('error', (error) => {
        throw new Error(error.message);
    });

    var imageUrl = '';

    blobStream.on('finish', async () => {
        imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    });

    blobStream.end(image.buffer);

    return imageUrl;
};

module.exports = { predict };