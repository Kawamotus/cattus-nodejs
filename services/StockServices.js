import mongoose from "mongoose";
import stock from "../models/stock.js";

const Stock = mongoose.model("stock", stock);

class StockServices{

}

export default new StockServices();
