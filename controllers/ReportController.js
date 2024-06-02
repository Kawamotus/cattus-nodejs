import express from "express";

import AnimalServices from "../services/AnimalServices.js";
import ActivityServices from "../services/ActivityServices.js";
import ReportServices from "../services/ReportServices.js";

const router = express.Router();

router.get("/:animal_id", async (req, res) => {
    try {
        const act = await ActivityServices.SelectAll(req.params.animal_id)
        const aut = await AnimalServices.SelectOne(req.params.animal_id)
        res.status(200)

        const pdf = await ReportServices.ReportSingleAnimal(act, aut)

        res.setHeader('Content-type', 'application/pdf');
        res.setHeader('Content-disposition', 'inline; filename="relatorio-cattus.pdf"');
        pdf.pipe(res);
        pdf.end()
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erro interno do servidor.' })
    }
})

export default router