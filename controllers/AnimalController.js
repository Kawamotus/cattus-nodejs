import express from "express";
import middlewares from "../middlewares/middlewares.js"
import utils from "../utils/utils.js";
import multer from "multer"


import AnimalServices from "../services/AnimalServices.js";
import Animal from "../models/animal.js"

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/create", upload.fields([{ name: 'petPicture', maxCount: 1 }, { name: 'petVaccCard', maxCount: 1 }]), middlewares.checkNecessaryFields(Animal), async (req, res) => {
    const [filesPetVaccCard] = req.files.petVaccCard
    const [filesPetPicture] = req.files.petPicture

    const petPicture = `${Date.now()}_${filesPetPicture.originalname}`
    const petVaccCard = `${Date.now()}_${filesPetVaccCard.originalname}`
    try {
        await utils.uploadPicture(filesPetPicture, petPicture)
        await utils.uploadPicture(filesPetVaccCard, petVaccCard)

        const petPictureUrl = await utils.getUploadedPicture(petPicture)
        const petVaccCardUrl = await utils.getUploadedPicture(petVaccCard)

        const data = utils.unFlatten(req.body)
        try {
            const operation = await AnimalServices.Create({
                petPicture: petPictureUrl,
                petVaccCard: petVaccCardUrl,
                ...data
            })

            res.status(201).send({
                ok: true,
                message: "Animal cadastrado com sucesso.",
                _id: operation._id
            });

        } catch (error) {
            console.log(error);
            res.status(400).send({
                message: "Erro ao cadastrar o animal.",
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Erro interno no servidor" })
    }
});

router.get("/select-all/:company_id", (req, res) => {
    const operation = AnimalServices.SelectAll(req.params.company_id, req.query.skip, req.query.limit)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.status(400).send({
            message: "Erro ao listar animais.",
        });
    })
})

router.get("/select-one/:animal_id", (req, res) => {
    const operation = AnimalServices.SelectOne(req.params.animal_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.status(400).send({
            message: "Erro ao listar o animal.",
        });
    })
})

router.post("/search", async (req, res) => {
    const query = req.body.query
    const fields = req.body.fields
    const company = req.session.user.company

    try {
        const searchQuery = utils.generateSearchQuery(query, fields)
        const operation = await AnimalServices.SelectAllByFields(company, searchQuery)
        res.send(operation)
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Erro interno no servidor." })
    }
})

router.get("/charts/sick-animals", async (req, res) => {
    const company = req.session.user.company
    try {
        const [result] = await AnimalServices.SelectSickAnimals(company)
        res.send({ok: true, result})
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Erro interno no servidor." })
    }
})

router.get("/charts/total-animals", async (req, res) => {
    const company = req.session.user.company
    try {
        const [result] = await AnimalServices.SelectTotalAnimals(company)
        res.send({ok: true, result})
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Erro interno no servidor." })
    }
})

router.delete("/delete/:animal_id", (req, res) => {
    const operation = AnimalServices.Delete(req.params.animal_id)
    operation.then(result => {
        res.status(204).send({
            ok: true,
        });
    }).catch(error => {
        console.log(error);
        res.status(400).send({
            message: "Erro ao deletar o animal.",
        });
    })
})

router.patch("/update/:animal_id", async (req, res) => {
    const id = req.params.animal_id
    const data = req.body

    try {
        const updatedFields = utils.buildUpdateFields(data)
        const operation = await AnimalServices.Update(id, updatedFields)

        res.send({
            ok: true,
            message: "Animal atualizado com sucesso.",
            _id: operation._id
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({ message: `Erro ao atualizar os dados do animal.` })
    }
});

export default router;