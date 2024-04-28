import mongoose from "mongoose";
import notification from "../models/notification.js";

const Notification = mongoose.model("notification", notification);

class NotificationServices{

    SelectAll(){
        return Notification.find();
    }

    SelectOne(id){
        return Notification.findOne({_id: id});
    }

    Create(){
        //nao sei se vai ser feito por aqq ou em outra sessao, pois eh pra ser algo automatico
    }

    UpdateRead(id){
        //retornar na "OnClick", se pah, quando o cliente clicar na notificacao e apos isso, enviar para detalhes, caso haja uma tela assim
        Notification.findByIdAndUpdate(id, {
            notificationStatus: true
        }).then(() =>{
            console.log("Notificacao " + id + " lida");
        }).catch(err =>{
            console.log(err);
        });
    }

}

export default new NotificationServices();
