import express from "express";
import session from "express-session";
import cors from "cors"
import middlewares from "../middlewares/middlewares.js";

const app = express();
const openRoutes = ['/employee/login', '/employee/logout'];

app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(session({
    secret: 'gatinhos',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000,
        secure: false
    }
}));

app.use((req, res, next) => {
    if (openRoutes.includes(req.path)) {
        return next();
    }
    middlewares.authenticate(req, res, next)
});

export default app