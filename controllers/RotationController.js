import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs"

import rotateImageLinear from "../services/RotationServices.js"

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post("/", upload.single('image'), async (req, res) => {
    const angle = parseInt(req.body.angle)
    if (!req.file)
        return res.status(400).send('Arquivo da imagem não encontrado.')
    
    const inputPath = req.file.path;
    const outputPath = path.join('uploads', `rotated_${req.file.originalname}`)

    try {
        const rotatedImage = await rotateImageLinear(inputPath, angle)
        await rotatedImage.toFile(outputPath);

        res.sendFile(path.resolve(outputPath), (err) => {
            if (err)
                res.status(500).send('Erro ao enviar o arquivo.')
            
            fs.unlinkSync(inputPath); // Limpa o cache da imagem processada
            fs.unlinkSync(outputPath);
        })
    } catch (error) {
        res.status(500).send('Erro ao processar a imagem.')
    }
})

export default router
