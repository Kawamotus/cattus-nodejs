import mongoose from "mongoose";

const stock = new mongoose.Schema({
    stockProduct: String,
    stockAmount: Number,
    stockCapacity: Number,
    stockSpendByDay: Number
});

export default stock;