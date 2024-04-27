import mongoose from "mongoose";
import activity from "../models/activity.js";

const Activity = mongoose.model("activity", activity);

class ActivityServices{

    SelectAllById(id){
        return Activity.find({_id: id});
    }
}

export default new ActivityServices();
