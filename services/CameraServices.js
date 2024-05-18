import mongoose from "mongoose";
import camera from "../models/camera.js";

const Camera = mongoose.model("camera", camera);

class CameraServices{

    SelectAll(){
        return Camera.find();
    }

    SelectOne(id){
        return Camera.findOne({_id: id});
    }

    Delete(id){
       return Camera.findByIdAndDelete(id)
    }

    Create(data){
        const newCamera = new Camera(data);
        return newCamera.save();
    }

    Update(id, data){
        return Camera.findByIdAndUpdate(id, data)
    }

}

export default new CameraServices();
