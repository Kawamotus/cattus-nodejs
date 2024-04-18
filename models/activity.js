import mongoose from "mongoose";

const activity = mongoose.Schema({
    activityAuthor: String, //_id do bicho
    activtyData: {
        activityName: String,
        activityStart: Date,
        activityEnd: Date
    }
});

export default activity;