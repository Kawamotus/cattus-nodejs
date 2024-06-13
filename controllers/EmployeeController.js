import express from "express";
import middlewares from "../middlewares/middlewares.js"
import bcrypt from "bcrypt"
import utils from "../utils/utils.js";
import multer from "multer"

import EmployeeServices from "../services/EmployeeServices.js";
import Employee from "../models/employee.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/create", upload.single('employeePicture'), middlewares.checkNecessaryFields(Employee), async (req, res) => {
    const file = req.file;
    const uniqueFileName = `${Date.now()}_${file.originalname}`
    
    try {
        await utils.uploadPicture(file, uniqueFileName)  
        const uploadedProfilePicture = await utils.getUploadedPicture(uniqueFileName)

        const data = req.body
        try {
            const operation = await EmployeeServices.Create({ employeePicture: uploadedProfilePicture, ...data })
            
            res.status(201).send({
                ok: true,
                message: "Usuário cadastrado com sucesso.",
                _id: operation._id
            });
            
        } catch (error) {
            console.log(error);
            res.status(400).send({
                message: "Erro ao cadastrar usuário.",
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Erro interno no servidor"})
    }

});

router.get("/select-all/:id_company", (req, res) => {
    const operation = EmployeeServices.SelectAll(req.params.id_company, req.query.skip, req.query.limit)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.status(400).send({
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
        res.status(400).send({
            message: "Erro ao lista o usuário.",
        });
    })
})

router.delete("/delete/:employee_id", (req, res) => {
    const operation = EmployeeServices.Delete(req.params.employee_id)

    operation.then(result => {
        res.status(204).send({
            ok: true,
            message: "Usuário deletado com sucesso."
        });
    }).catch(error => {
        console.log(error);
        res.status(400).send({
            message: "Erro ao deletar o usuário.",
        });
    })
})

router.patch("/update/:employee_id", (req, res) => {
    const id = req.params.employee_id
    const data = req.body

    const operation = EmployeeServices.Update(id, data)
    operation.then(result => {
        res.status(204).send({
            ok: true,
            message: "Usuário atualizado com sucesso.",
        });
    }).catch(error => {
        console.log(error);
        res.status(400).send({
            message: "Erro ao atualizar os dados do usuário.",
        });
    })
});

router.post("/login", async (req, res) => {
    const { employeeEmail, employeePassword } = req.body

    try {
        const checkUserExists = await EmployeeServices.SelectOneByEmail(employeeEmail)

        if (!checkUserExists) {
            return res.status(401).send({ message: 'Usuário não encontrado.' })
        }

        if (!await bcrypt.compare(employeePassword, checkUserExists.employeePassword)) {
            return res.status(401).send({ message: 'Email ou senha inválidos.' })
        }


        res.send({
            ok: true,
            message: "Usuário autenticado com sucesso.",
            token: utils.generateToken(checkUserExists)
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Erro interno ao tentar logar." })
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ message: 'Erro interno ao tentar deslogar.' });
        }
        res.send({ message: 'Usuário deslogado com sucesso.' });
    });
});

export default router;