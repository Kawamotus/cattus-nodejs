import mongoose from "mongoose";
import notification from "../models/notification.js";

const Notification = mongoose.model("notification", notification);

class NotificationServices{

}

export default new NotificationServices();
