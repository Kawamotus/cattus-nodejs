import express from "express";
import middlewares from "../middlewares/middlewares.js";

import NotificationService from "../services/NotificationService.js";
import Notication from "../models/notification.js"

const router = express.Router();

router.post("/create", middlewares.checkNecessaryFields(Notication), (req, res) => {
    const data = req.body

    const operation = NotificationService.Create(data)
    operation.then(result => {
        res.send({
            ok: true,
            message: "Notificação registrada com sucesso.",
            _id: result._id
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao registrar a notificação.",
        });
    })
});

router.get("/select-all/:target_id", (req, res) => {
    const operation = NotificationService.SelectAll(req.params.target_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao listar as notificações.",
        });
    })
})

router.get("/select-one/:notification_id", (req, res) => {
    const operation = NotificationService.SelectOne(req.params.notification_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao listar as notificação.",
        });
    })
})

router.get("/delete/:notification_id", (req, res) => {
    const operation = NotificationService.Delete(req.params.notification_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao deletar a notificação.",
        });
    })
})

export default router;