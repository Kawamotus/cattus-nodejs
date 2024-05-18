import mongoose from "mongoose";
import notification from "../models/notification.js";

const Notification = mongoose.model("notification", notification);

class NotificationServices{

    SelectAll(id){
        return Notification.find({notificationTarget: id}).populate("notificationOrigin");
    }

    SelectOne(id){
        return Notification.findById(id).populate("notificationOrigin");
    }

    Create(data){
        const newNotification = new Notification(data)
        return newNotification.save()
    }

    UpdateRead(id){
        //retornar na "OnClick", se pah, quando o cliente clicar na notificacao e apos isso, enviar para detalhes, caso haja uma tela assim
        return Notification.findByIdAndUpdate(id, {notificationStatus: true})
    }

}

export default new NotificationServices();
