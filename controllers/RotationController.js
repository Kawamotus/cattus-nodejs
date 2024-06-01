import express from "express"
import rotateImageLinear from "../services/RotationServices.js"

const router = express.Router()

router.post("/", async (req, res) => {
    const angle = parseInt(req.body.angle)
    const img_url = req.body.img_url
    if (!req.body.img_url)
        return res.status(400).send('URL da imagem não encontrado.')

    try {
        const rotatedImage = await rotateImageLinear(img_url, angle)
        if (!rotatedImage) res.status(400).send({ message: "Erro ao tentar rotacionar a imagem." })

        res.send({ message: "Imagem rotacionada com sucesso.", url: rotatedImage })
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao processar a imagem.')
    }
})

export default router
