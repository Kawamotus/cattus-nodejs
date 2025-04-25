import app from "./config/server.js"
import database from "./config/database.js";
import http from "http"
import { Server } from "socket.io";
import socketHandlers from "./config/socketHandlers.js";
import utils from "./utils/utils.js";
import multer from "multer"

import ActivityController from "./controllers/ActivityController.js";
import AnimalController from "./controllers/AnimalController.js";
import CameraController from "./controllers/CameraController.js";
import CompanyController from "./controllers/CompanyController.js";
import EmployeeController from "./controllers/EmployeeController.js";
import NotificationController from "./controllers/NotificationController.js";
import StockController from "./controllers/StockController.js";
import ReportController from "./controllers/ReportController.js";
import RotationController from "./controllers/RotationController.js";

import dotenv from "dotenv"

dotenv.config()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.post("/upload-image", upload.single('imagem'), async (req, res) => {
    const file = req.file;
    const uniqueFileName = `${Date.now()}_${file.originalname}`

    try {
        await utils.uploadPicture(file, uniqueFileName)
        const uploadedImagem = await utils.getUploadedPicture(uniqueFileName)

        try {
            res.status(200).send({
                ok: true,
                message: "Sucesso no upload da imagem.",
                img_url: uploadedImagem
            });

        } catch (error) {
            console.log(error);
            res.status(400).send({
                message: "Erro ao fazer upload da imagem.",
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Erro interno no servidor" })
    }
})

app.get("/", (req, res) => {
    res.send(req.session.user)
})

app.use("/activity", ActivityController);
app.use("/animal", AnimalController);
app.use("/camera", CameraController);
app.use("/company", CompanyController);
app.use("/employee", EmployeeController);
app.use("/notification", NotificationController);
app.use("/stock", StockController);
app.use("/report", ReportController);
app.use("/rotate", RotationController);

try {
    const db = await database.connect()
    const server = http.createServer(app)
    // const io = new Server({
    //     cors: {
    //         origin: "*"
    //     },
    //     ...server
    // })
  
    const PORT = process.env.PORT
    server.listen(PORT, () => console.log(`Servidor rodando: http://localhost:${PORT}`))

    // try {
    //     io.listen(server)
    //     io.on("connection", (socket) => {
    //         console.log("Cattus WEB conectado.");
    //         socketHandlers(db, socket)
    //     });

    // } catch (error) {
    //     console.log("Ocorreu um erro ao tentar iniciar o servidor WebSocket: " + error);
    // }

} catch (error) {
    console.log("Ocorreu um erro ao tentar iniciar o servidor: " + error)
}

