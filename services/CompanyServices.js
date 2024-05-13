import mongoose from "mongoose";
import company from "../models/company.js";

const Company = mongoose.model("Company", company);

class CompanyServices{

    Create(data){
        const newCompany = new Company(data);
        return newCompany.save();
    }

    SelectOne(id){
        return Company.findOne({_id: id});
    }

    Update(id, data){
        return Company.findByIdAndUpdate(id, data)
    }

    //delete?
}

export default new CompanyServices();
