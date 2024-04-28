import mongoose from "mongoose";
import company from "../models/company.js";

const Company = mongoose.model("company", company);

class CompanyServices{

    Create(companyName, companyCNPJ, companyLogo, companyColor){
        const newCompany = new Company({
            companyName: companyName,
            companyCNPJ: companyCNPJ,
            companyDetails:{
                companyColor: companyColor,
                companyLogo: companyLogo
            }
        });
        newCompany.save();
    }

    SelectOne(id){
        return Company.findOne({_id: id});
    }

    Update(id){
        Company.findByIdAndUpdate(id, {
            companyName: companyName,
            companyCNPJ: companyCNPJ,
            companyDetails:{
                companyColor: companyColor,
                companyLogo: companyLogo
            }
        }).then(()=>{
            console.log("Empresa " + companyName + " atualizada com sucesso!");
        }).catch(err => {
            console.log(err);
        });
    }

    //delete?
}

export default new CompanyServices();
