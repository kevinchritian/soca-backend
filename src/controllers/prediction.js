const response = require('../Utils/response');
const tf = require('@tensorflow/tfjs-node');
const { db } = require('../database/db');
const { History } = require('../database/schema');
const { uploadFile } = require('../config/storage');

let model;
const loadModel = async () => {
    const modelUrl = process.env.MODEL_URL;
    model = await tf.loadGraphModel(modelUrl);
};
loadModel();

const predict = async (req, res) => {
    try {
        const image = req.file;
        if (!image) {
            return response.error(res, 'Image is required');
        }

        if (!model) {
            return response.error(res, 'Model not loaded yet');
        }

        const inputSize = parseInt(process.env.INPUT_SIZE);

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

        tensor.dispose();
        prediction.dispose();

        const result = {
            label: label,
            confidenceScore: confidenceScore,
        }

        const resp = await saveResult(req, result, image);
        response.success(res, 'Prediction success', resp);
    } catch (error) {
        response.internalError(res, error.message);
    }
};

const saveResult = async (req, result, image) => {
    const imageUrl = await uploadFile(image);
    const history = await db.insert(History).values({ userId: req.user.id, label: result.label, confidenceScore: result.confidenceScore, image: imageUrl }).returning();
    return history.at(0);
};

module.exports = { predict };
