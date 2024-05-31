import app from "./config/server.js"
import database from "./config/database.js";
import http from "http"
import { Server } from "socket.io";
import socketHandlers from "./config/socketHandlers.js";

import ActivityController from "./controllers/ActivityController.js";
import AnimalController from "./controllers/AnimalController.js";
import CameraController from "./controllers/CameraController.js";
import CompanyController from "./controllers/CompanyController.js";
import EmployeeController from "./controllers/EmployeeController.js";
import NotificationController from "./controllers/NotificationController.js";
import StockController from "./controllers/StockController.js";
import ReportController from "./controllers/reportController.js";
import RotationController from "./controllers/RotationController.js";

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
    const io = new Server({
        cors: {
            origin: "*"
        },
        ...server
    })
    server.listen(8080, () => console.log("Servidor rodando: http://localhost:8080"))

    try {
        io.listen(server)
        io.on("connection", (socket) => {
            console.log("Cattus WEB conectado.");
            socketHandlers(db, socket)
        });

    } catch (error) {
        console.log("Ocorreu um erro ao tentar iniciar o servidor WebSocket: " + error);
    }

} catch (error) {
    console.log("Ocorreu um erro ao tentar iniciar o servidor: " + error)
}

