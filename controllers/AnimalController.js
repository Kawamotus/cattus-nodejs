import express from "express";
import AnimalServices from "../services/AnimalServices.js";

const router = express.Router();

router.get("/select-all/:company_id", (req, res) => {
    const operation = AnimalServices.SelectAll(req.params.company_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
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
        res.send({
            message: "Erro ao lista o animal.",
        });
    })
})

router.get("/delete/:animal_id", (req, res) => {
    const operation = AnimalServices.Delete(req.params.animal_id)

    operation.then(result => {
        res.send({
            ok: true,
            result
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao lista o animal.",
        });
    })
})

router.post("/create", (req, res) => {
    const data = req.body

    const operation = AnimalServices.Create(data)
    operation.then(result => {
        res.send({
            ok: true,
            message: "Animal cadastrado com sucesso.",
            _id: result._id
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao cadastrar animal.",
        });
    })
});

router.post("/update/:animal_id", (req, res) => {
    const id = req.params.animal_id
    const data = req.body

    const operation = AnimalServices.Update(id, data)
    operation.then(result => {
        res.send({
            ok: true,
            message: "Animal atualizado com sucesso.",
            _id: result._id
        });
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao atualizar os dados do animal.",
        });
    })
});

export default router;