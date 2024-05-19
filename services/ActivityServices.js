import mongoose from "mongoose";
import activity from "../models/activity.js";

const Activity = mongoose.model("activity", activity);

class ActivityServices{

    SelectAll(id){
        return Activity.find({activityAuthor: id}).populate("activityAuthor");
    }

    SelectAllNoCriteria(){
        return Activity.find();
    }

    SelectOne(id){
        return Activity.findById(id).populate("activityAuthor");
    }

    Create(data){
        const newActivity = new Activity(data);
        return newActivity.save()
    }

    Delete(id){
        return Activity.findByIdAndDelete(id)
    }

}

export default new ActivityServices();
