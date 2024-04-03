import express from "express";
const router = express.Router();

router.get("/login", (req, res) =>{
    let titulo = "Login | Cattus";

    res.render("login", {
        titulo: titulo
        //user: user,
        //password: password
        //login: login (?)
    });
});

export default router;