import express from "express";
import middlewares from "../middlewares/middlewares.js"

import AnimalServices from "../services/AnimalServices.js";
import Animal from "../models/animal.js"
import ActivityServices from "../services/ActivityServices.js";

import PdfPrinter from "pdfmake"

const router = express.Router();

router.post("/create", middlewares.checkNecessaryFields(Animal), (req, res) => {
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
            message: "Erro ao listar o animal.",
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
            message: "Erro ao deletar o animal.",
        });
    })
})

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

router.get("/show", (req, res) => {
    const operation = ActivityServices.SelectAllNoCriteria()

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


router.get("/report", (req,res) => {

    const operation = ActivityServices.SelectAllNoCriteria()
    const body = []

    operation.then(result => {
        const activities = result;
    
        if (!Array.isArray(activities)) {
            throw new Error("A resposta da API não contém um array de atividades.");
        }
        
        for (let activity of activities) {
            const rows = []
            // rows.push(activity.activityAuthor.petName)
            rows.push(activity.activtyData.activityName)
            rows.push(activity.activtyData.activityStart)
            rows.push(activity.activtyData.activityEnd)
        
            body.push(rows)
        }
        // console.log(body)
        // res.send({body})
    }).catch(error => {
        console.log(error);
        res.send({
            message: "Erro ao listar atividades.",
        });
    })

    var fonts = {
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
          }
    }

    const printer = new PdfPrinter(fonts)

    const docDefinition = {
        defaultStyle: {font: "Helvetica"},
        content: [
            {
                table: {
                    body: [
                        ["Autor", "Atividade", "Início", "Término"],
                        ...body  
                    ]
            }}
        ]
    }

    const pdfDoc = printer.createPdfKitDocument(docDefinition)
    
    const chunks = []

    pdfDoc.on("data", (chunk) => {
        chunks.push(chunk)
    })

    pdfDoc.end()

    pdfDoc.on("end", () => {
        const result = Buffer.concat(chunks)
        res.end(result)
    })
    
})

export default router;