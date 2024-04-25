import express from "express";
import mongoose from "mongoose";

import ActivityController from "./controllers/ActivityController.js";
import AnimalController from "./controllers/AnimalController.js";
import CameraController from "./controllers/CameraController.js";
import CompanyController from "./controllers/CompanyController.js";
import EmployeeController from "./controllers/EmployeeController.js";
import NotificationController from "./controllers/NotificationController.js";
import StockController from "./controllers/StockController.js";

const app = express();

app.use("/", ActivityController);
app.use("/", AnimalController);
app.use("/", CameraController);
app.use("/", CompanyController);
app.use("/", EmployeeController);
app.use("/", NotificationController);
app.use("/", StockController);

mongoose.connect("mongodb://localhost:27017");

app.get("/", (req, res) =>{
    res.send("Oi Mundo");
});

app.listen(8080, function (erro){
    if(erro){
        console.log("Erro " + erro)
    }
    else{
        console.log("servidor iniciado")
    }
})