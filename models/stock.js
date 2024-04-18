import mongoose from "mongoose";

const stock = mongoose.Schema({
    stockProduct: String,
    stockAmount: Number,
    stockCapacity: Number,
    stockSpendByDay: Number
});

export default stock;