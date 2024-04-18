import mongoose from "mongoose";
import activity from "../models/activity.js";

const Activity = mongoose.model("activity", activity);

class ActivityServices{

}

export default new ActivityServices();
