import mongoose from "mongoose";

const notification = mongoose.Schema({
    notificationDate: String,
    notificationTarget: String, //empresa, usuário, depende do caso
    notificationOrigin: String, //insumos, pets, funcionarios, alguma coisa
    notificationStatus: Number, //lido ou não
    notificationDescription: String
});

export default notification;