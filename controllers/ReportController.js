import express from "express";

import AnimalServices from "../services/AnimalServices.js";
import ActivityServices from "../services/ActivityServices.js";
import ReportServices from "../services/ReportServices.js";

const router = express.Router();

router.get("/animal/:animal_id", async (req,res) => {
    try {
        const act = await ActivityServices.SelectAll(req.params.animal_id)
        const aut = await AnimalServices.SelectOne(req.params.animal_id)
        res.status(200)

        const pdf = ReportServices.ReportSingleAnimal(act, aut)

        const chunks = []
    
        pdf.on("data", (chunk) => {
            chunks.push(chunk)
        })
     
        pdf.end()
    
        pdf.on("end", () => {
            const result = Buffer.concat(chunks)
            res.end(result)
        })
    } catch(error) {
        console.log(error)
        res.status(500).json({error : 'Erro interno do servidor.'})
    }
})

export default router