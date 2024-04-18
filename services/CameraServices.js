import mongoose from "mongoose";
import camera from "../models/camera.js";

const Camera = mongoose.model("camera", camera);

class CameraServices{

}

export default new CameraServices();
