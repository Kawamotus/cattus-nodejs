import mongoose from "mongoose";

const activity = new mongoose.Schema({
    activityAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal', //_id do bicho
        require: true
    }, 
    activityData: {
        activityName: String,
        activityStart: Date,
        activityEnd: Date
    }
});

export default activity;