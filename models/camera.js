import mongoose from "mongoose";

const camera = new mongoose.Schema({
    cameraStatus: Number,
    cameraLocation: String,
    cameraDescription: String
});

export default camera;
