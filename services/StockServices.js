import mongoose from "mongoose";
import stock from "../models/stock.js";

const Stock = mongoose.model("Stock", stock);

class StockServices{
    SelectAll(company){
        return Stock.find({company: company}).populate("company")
    }

    SelectOne(id){
        return Stock.findById(id).populate("company");
    }

    Create(data){
        const newStock = new Stock(data);
        return newStock.save()
    }

    Delete(id){
        return Stock.findByIdAndDelete(id)
    }

    Update(id, data){
        return Stock.findByIdAndUpdate(id, data)
    }
}

export default new StockServices();
