import mongoose from "mongoose";

const camera = new mongoose.Schema({
    cameraStatus: Number,
    cameraLocation: String,
    cameraDescription: String,
    cameraUrl: String,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', //id da empresa de origem do pet
        require: true
    }
});

export default camera;
