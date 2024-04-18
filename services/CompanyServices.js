import mongoose from "mongoose";
import company from "../models/company.js";

const Company = mongoose.model("company", company);

class CompanyServices{

}

export default new CompanyServices();
