import express from "express";
import middlewares from "../middlewares/middlewares.js"

import EmployeeServices from "../services/EmployeeServices.js";
import Employee from "../models/employee.js";

const router = express.Router();

router.post("/create", middlewares.checkNecessaryFields(Employee), (req, res) => {
    const data = req.body

    const operation = EmployeeServices.Create(data)
    operation.then(result => {
        res.send({
            ok: true,
            message: "Usuário cadastrado com sucesso.",
            _id: result._id
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao cadastrar usuário.",
        });
    })
});

router.get("/select-all", (req, res) => {
    const operation = EmployeeServices.SelectAll()

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao listar usuários.",
        });
    })
})

router.get("/select-one/:employee_id", (req, res) => {
    const operation = EmployeeServices.SelectOne(req.params.employee_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao lista o usuário.",
        });
    })
})

router.get("/delete/:employee_id", (req, res) => {
    const operation = EmployeeServices.Delete(req.params.employee_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao deletar o usuário.",
        });
    })
})

router.post("/update/:employee_id", (req, res) => {
    const id = req.params.employee_id
    const data = req.body

    const operation = EmployeeServices.Update(id, data)
    operation.then(result => {
        res.send({
            ok: true,
            message: "Usuário atualizado com sucesso.",
            _id: result._id
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao atualizar os dados do usuário.",
        });
    })
});

export default router;