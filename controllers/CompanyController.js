import express from "express";
import middlewares from "../middlewares/middlewares.js"
import utils from "../utils/utils.js";
import multer from "multer"

import CompanyServices from "../services/CompanyServices.js";
import Company from "../models/company.js"

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/create", upload.single('companyLogo'), middlewares.checkNecessaryFields(Company), async (req, res) => {
    const file = req.file;
    const uniqueFileName = `${Date.now()}_${file.originalname}`

    try {
        await utils.uploadPicture(file, uniqueFileName)
        const uploadedCompanyLogo = await utils.getUploadedPicture(uniqueFileName)

        const data = utils.unFlatten(req.body)
        try {
            const operation = await CompanyServices.Create({ companyLogo: uploadedCompanyLogo, ...data })

            res.status(201).send({
                ok: true,
                message: "Empresa cadastrada com sucesso.",
                _id: operation._id
            });

        } catch (error) {
            console.log(error);
            res.status(400).send({
                message: "Erro ao cadastrar Empresa.",
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Erro interno no servidor" })
    }
});

router.patch("/update/:company_id", async (req, res) => {
    const id = req.params.company_id
    const data = req.body

    try {
        const updatedFields = utils.buildUpdateFields(data)
        const operation = await CompanyServices.Update(id, updatedFields)

        res.send({
            ok: true,
            message: "Empresa atualizada com sucesso.",
            _id: operation._id
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({ message: `Erro ao atualizar os dados do empresa.` })
    }
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
        res.status(400).send({
            message: "Erro ao listar empresa.",
        });
    })
});

export default router;