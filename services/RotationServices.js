import sharp from "sharp"
import utils from "../utils/utils.js"
import { fileTypeFromBuffer } from "file-type"

const imgLinearRotation = async (img_url, angle) => {
    const imageDownloaded = await (await fetch(img_url)).arrayBuffer()

    const image = await sharp(imageDownloaded).raw().toBuffer({ resolveWithObject: true })
    const { data, info } = image

    const width = info.width
    const height = info.height
    const xcenter = width / 2
    const ycenter = height / 2

    const angleRadian = (Math.PI / 180) * angle;
    const cosAngle = Math.cos(angleRadian)
    const sinAngle = Math.sin(angleRadian)

    const rotatedData = Buffer.alloc(data.length);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const newX = Math.floor(cosAngle * (x - xcenter) - sinAngle * (y - ycenter) + xcenter) // Matriz de rotação,
            const newY = Math.floor(sinAngle * (x - xcenter) + cosAngle * (y - ycenter) + ycenter) // Ela define as nova posições dos pixels

            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                const newIdx = (newY * width + newX) * 3;
                const oldIdx = (y * width + x) * 3;
                rotatedData[newIdx] = data[oldIdx];
                rotatedData[newIdx + 1] = data[oldIdx + 1];
                rotatedData[newIdx + 2] = data[oldIdx + 2]; // Realoca os pixels com sua nova posição no buffer
            }
        }
    }
    {
        const rotatedImage = await sharp(rotatedData, {
            raw: {
                width: width,
                height: height,
                channels: 3
            }
        }).png().toBuffer()
        const type = await fileTypeFromBuffer(rotatedImage)

        const rotatedImageName = `rotated_${Date.now()}_${img_url.split("/")[3]}`
        try {
            await utils.uploadPicture({ buffer: rotatedImage, mimetype: type.mime }, rotatedImageName)

            return utils.getUploadedPicture(rotatedImageName)
        } catch (error) {
            console.log("Erro ao fazer upload da imagem rotacionada: " + error);
        }
    }

}


export default imgLinearRotation