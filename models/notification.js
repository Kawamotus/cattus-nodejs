import mongoose from "mongoose";

const notification = new mongoose.Schema({
    notificationDate: String,
    notificationTarget: String, //empresa, usuário, depende do caso
    notificationOrigin: String, //insumos, pets, funcionarios, alguma coisa
    notificationStatus: Boolean, //true: read, false: not read
    notificationDescription: String
});

export default notification;