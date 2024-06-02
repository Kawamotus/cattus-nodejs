import mongoose from "mongoose";
import notification from "../models/notification.js";

const Notification = mongoose.model("notification", notification);

class NotificationServices {

    SelectAll(id) {
        return Notification.find({ notificationTarget: id }).populate("notificationOrigin").populate("notificationTarget");
    }

    SelectOne(id) {
        return Notification.findById(id).populate("notificationOrigin").populate("notificationTarget");
    }

    Create(data) {
        const newNotification = new Notification(data)
        return newNotification.save()
    }

    Delete(id){
        return Notification.findByIdAndDelete(id)
     }

    UpdateRead(id) {
        return Notification.findByIdAndUpdate(id, { notificationStatus: true })
    }

}

export default new NotificationServices();
