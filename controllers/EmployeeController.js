import express from "express";
import middlewares from "../middlewares/middlewares.js"
import bcrypt from "bcrypt"
import utils from "../utils/utils.js";

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

router.post("/login", async (req, res) => {
    const {employeeEmail, employeePassword} = req.body

    const checkUserExists = await EmployeeServices.SelectOneByEmail(employeeEmail)
    if(!checkUserExists) {
        return res.status(400).send({message:'Usuário não encontrado.'})
    }

    if(!await bcrypt.compare(employeePassword, checkUserExists.employeePassword)) {
        return res.status(400).send({message:'Senha inválida.'})
    }

    res.send({
        ok: true,
        message: "Usuário autenticado com sucesso.",
        token: utils.generateToken(checkUserExists)
    })

})

export default router;