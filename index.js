import express from "express";
const app = express();

import mongoose from "mongoose";

import loginController from "./controllers/loginController.js";

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use("/", loginController);

mongoose.connect("mongodb://localhost:27017");

app.get("/", (req, res) =>{
    let titulo = "Início | Nome da empresa";
    res.render("index", {
        titulo: titulo
    });
});




app.listen(8080, function (erro){
    if(erro){
        console.log("Erro " + erro)
    }
    else{
        console.log("servidor iniciado")
    }
})