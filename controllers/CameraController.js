import express from "express";
import middlewares from "../middlewares/middlewares.js"
import utils from "../utils/utils.js";

import CameraServices from "../services/CameraServices.js";
import Camera from "../models/camera.js";

const router = express.Router();

router.post("/create", middlewares.checkNecessaryFields(Camera), (req, res) => {
    const data = req.body

    const operation = CameraServices.Create(data)
    operation.then(result => {
        res.status(201).send({
            ok: true,
            message: "Câmera registrada com sucesso.",
            _id: result._id
        });
    }).catch(error => {
        console.log(error);
        res.status(400).send({
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
        res.status(400).send({
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
        res.status(400).send({
            message: "Erro ao listar a câmera.",
        });
    })
})

router.delete("/delete/:camera_id", (req, res) => {
    const operation = CameraServices.Delete(req.params.camera_id)

    operation.then(result => {
        res.status(204).send({
            ok: true,
        });
    }).catch(error => {
        console.log(error);
        res.status(400).send({
            message: "Erro ao deletar a câmera.",
        });
    })
})

router.post("/search", async (req, res) => {
    const query = req.body.query
    const fields = req.body.fields
    const company = req.session.user.company

    try {
        const searchQuery = utils.generateSearchQuery(query, fields)
        const operation = await CameraServices.SelectAllByFields(company, searchQuery)
        res.send({
            ok: true,
            operation
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Erro interno no servidor." })
    }
})

export default router;