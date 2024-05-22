import mongoose from "mongoose";

const company = new mongoose.Schema({
    companyCNPJ: String, 
    companyName: String,
    companyDetails: {
        companyLogo: String,
        companyColor: String,
        companyPhone: Number
    }
});

export default company;