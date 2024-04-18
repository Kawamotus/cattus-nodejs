import mongoose from "mongoose";

const company = mongoose.Schema({
    companyCNPJ: String, //number?
    companyName: String,
    companyDetails: {
        companyLogo: String,
        companyColor: String
        //algo mais?
    }
});

export default company;
