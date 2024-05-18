import mongoose from "mongoose";

const notification = new mongoose.Schema({
    notificationDate: Date,
    notificationTarget: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'Targets',
        require: true
    },
    Targets: {
        type: String,
        required: true,
        enum: ['Company', 'Employee']
    },
    notificationOrigin: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'Origin',
        require: true
    },
    Origin: {
        type: String,
        required: true,
        enum: ['Stock', 'Animal']
    },
    notificationStatus: Boolean,
    notificationDescription: String
});

export default notification;