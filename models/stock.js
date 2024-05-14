import mongoose from "mongoose";

const stock = new mongoose.Schema({
    stockProduct: String,
    stockAmount: Number,
    stockCapacity: Number,
    stockSpendByDay: Number,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', //id da empresa
        require: true
    } 
});

export default stock;