import express from "express";
import middlewares from "../middlewares/middlewares.js"

import CameraServices from "../services/CameraServices.js";
import Camera from "../models/camera.js";

const router = express.Router();

router.post("/create", middlewares.checkNecessaryFields(Camera), (req, res) => {
    const data = req.body

    const operation = CameraServices.Create(data)
    operation.then(result => {
        res.send({
            ok: true,
            message: "Câmera registrada com sucesso.",
            _id: result._id
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao registrar a câmera.",
        });
    })
});

router.get("/select-all/:company_id", (req, res) => {
    const operation = CameraServices.SelectAll(req.params.company_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao listar as câmeras.",
        });
    })
})

router.get("/select-one/:camera_id", (req, res) => {
    const operation = CameraServices.SelectOne(req.params.camera_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao listar a câmera.",
        });
    })
})

router.get("/delete/:camera_id", (req, res) => {
    const operation = CameraServices.Delete(req.params.camera_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao deletar a câmera.",
        });
    })
})

export default router;