import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()
class Database {
    async connect() {
        await mongoose.connect(process.env.DATABASE_URL)

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Erro na conexão ao MongoDB:'));

        console.log('Conectado ao MongoDB.');
        return db
    }
}

export default new Database();