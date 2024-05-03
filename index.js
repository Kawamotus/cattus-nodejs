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

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use("/activity", ActivityController);
app.use("/animal", AnimalController);
app.use("/camera", CameraController);
app.use("/company", CompanyController);
app.use("/employee", EmployeeController);
app.use("/notification", NotificationController);
app.use("/stock", StockController);

mongoose.connect("mongodb://localhost:27017/cattus-api");

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