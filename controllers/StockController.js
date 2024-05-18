import express from "express";
import middlewares from "../middlewares/middlewares.js"

import StockServices from "../services/StockServices.js";
import Stock from "../models/stock.js";

const router = express.Router();

router.post("/create", middlewares.checkNecessaryFields(Stock), (req, res) => {
    const operation = StockServices.Create(req.body)
    operation.then(result => {
        res.send({
            ok: true,
            message: "Item cadastrado com sucesso.",
            _id: result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao cadastrar o item.",
        });
    })
});

router.post("/update/:stock_id", (req, res) => {
    const id = req.params.stock_id
    const operation = StockServices.Update(id, req.body)
    operation.then(result => {
        res.send({
            ok: true,
            message: "Item atualizado com sucesso.",
            _id: result._id
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao atualizar o item.",
        });
    })
});

router.get("/select-one/:stock_id", (req, res) => {
    const id = req.params.stock_id
    const operation = StockServices.SelectOne(id)
    operation.then(result => {
        res.send({
            ok: true,
            _id: result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao listar o item.",
        });
    })
});

router.get("/select-all/:stock_id", (req, res) => {
    const operation = StockServices.SelectAll(req.params.stock_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao listar os itens.",
        });
    })
})

router.get("/delete/:stock_id", (req, res) => {
    const operation = StockServices.Delete(req.params.stock_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao deletar o item.",
        });
    })
})

export default router;