import mongoose from "mongoose";

const camera = mongoose.Schema({
    cameraStatus: Number,
    cameraLocation: String,
    cameraDescription: String
});

export default camera;
