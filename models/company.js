import mongoose from "mongoose";

const company = new mongoose.Schema({
    companyCNPJ: String,
    companyName: String,
    companyLogo: String,
    companyDetails: {
        companyColor: String,
        companyPhone: Number
    }
});

export default company;