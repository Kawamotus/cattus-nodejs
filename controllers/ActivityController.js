import express from "express";
import middlewares from "../middlewares/middlewares.js";

import ActivityServices from "../services/ActivityServices.js";
import Activity from "../models/activity.js";

const router = express.Router();

router.post("/create", middlewares.checkNecessaryFields(Activity), (req, res) => {
    const data = req.body

    const operation = ActivityServices.Create(data)
    operation.then(result => {
        res.send({
            ok: true,
            message: "Atividade registrada com sucesso.",
            _id: result._id
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao registrar atividade.",
        });
    })
});

router.get("/select-all/:author_id", (req, res) => {
    const operation = ActivityServices.SelectAll(req.params.author_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao listar as atividades.",
        });
    })
})

router.get("/select-one/:activity_id", (req, res) => {
    const operation = ActivityServices.SelectOne(req.params.activity_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao listar a atividade.",
        });
    })
})

router.get("/delete/:activity_id", (req, res) => {
    const operation = ActivityServices.Delete(req.params.activity_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao deletar a atividade.",
        });
    })
})


export default router;