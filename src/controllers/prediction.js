const { connection, mssql } = require('../config/database');
const response = require('../Utils/response');
const storage = require('../config/storage');
const tf = require('@tensorflow/tfjs-node');

const predict = async (req, res) => {
    try {
        const image = req.file;
        if (!image) {
            return response.error(res, 'Image is required');
        }

        // const modelUrl = process.env.MODEL_URL;
        // const model = await tf.loadGraphModel(modelUrl);

        // const tensor = tf.node
        //     .decodeJpeg(image.buffer)
        //     .resizeNearestNeighbor([150, 150])
        //     .expandDims()
        //     .toFloat();

        // const classes = process.env.CLASSES

        // const prediction = model.predict(tensor);

        // const score = await prediction.data();
        // const confidenceScore = Math.max(...score) * 100;

        // const classResult = tf.argMax(prediction, 1).dataSync()[0];
        // const label = classes[classResult];

        // const result = {
        //     label: label,
        //     confidenceScore: confidenceScore,
        // }

        const result = {
            label: 'nga',
            confidenceScore: 99.99,
        }

        await saveResult(req, result, image);

        response.success(res, 'Prediction success', result);
    } catch (error) {
        response.internalError(res, error.message);
    }
};

const saveResult = async (req, result, image) => {
    try {
        const conn = await connection();
        conn.request()
            .input('userId', mssql.Int, req.user.id)
            .input('image', mssql.VarChar, image.originalname)
            .input('label', mssql.VarChar, result.label)
            .input('confidenceScore', mssql.Float, result.confidenceScore)
            .input('createdAt', mssql.DateTime, new Date())
            .query('INSERT INTO history (userId, label, confidenceScore, image, createdAt) VALUES (@userId, @label, @confidenceScore, @image, @createdAt)');
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { predict };