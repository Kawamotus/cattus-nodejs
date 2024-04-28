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
        Camera.findByIdAndDelete(id).then(()=>{
            console.log("Camera " + id + " deletada com sucesso");
        }).catch(err =>{
            console.log(err);
        });
    }

    Create(cameraStatus, cameraLocation, cameraDescription){
        const newCamera = new Camera({
            cameraStatus: cameraStatus,
            cameraLocation: cameraLocation,
            cameraDescription: cameraDescription
        });
        newCamera.save();
    }

    Update(id, cameraStatus, cameraLocation, cameraDescription){
        Camera.findByIdAndUpdate(id, {
            cameraStatus: cameraStatus,
            cameraLocation: cameraLocation,
            cameraDescription: cameraDescription
        }).then(()=>{
            console.log("Dados da camera " + cameraLocation + " atualizados com sucesso");
        }).catch(err =>{
            console.log(err);
        });
    }

}

export default new CameraServices();
