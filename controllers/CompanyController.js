import express from "express";
import CompanyServices from "../services/CompanyServices.js";
import verificarCamposNecessarios from "../middlewares/checaCampos.js"
import Company from "../models/company.js"

const router = express.Router();

router.post("/create", verificarCamposNecessarios(Company), (req, res) => {
    const operation = CompanyServices.Create(req.body)
    operation.then(result => {
        res.send({
            ok: true,
            message: "Empresa cadastrada com sucesso.",
            _id: result._id
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao cadastrar empresa.",
        });
    })
});

router.post("/update/:company_id", (req, res) => {
    const id = req.params.company_id
    const operation = CompanyServices.Update(id, req.body)
    operation.then(result => {
        res.send({
            ok: true,
            message: "Empresa atualizada com sucesso.",
            _id: result._id
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao atualizar empresa.",
        });
    })
});

router.get("/select-one/:company_id", (req, res) => {
    const id = req.params.company_id
    const operation = CompanyServices.SelectOne(id)
    operation.then(result => {
        res.send({
            ok: true,
            _id: result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao listar empresa.",
        });
    })
});

export default router;