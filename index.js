import express from "express";
const app = express();

import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017");

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) =>{
    res.render("index");
});

app.listen(8080, function (erro){
    if(erro){
        console.log("Erro " + erro)
    }
    else{
        console.log("servidor iniciado")
    }
})