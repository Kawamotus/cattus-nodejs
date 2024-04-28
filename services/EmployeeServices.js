import mongoose from "mongoose";
import employee from "../models/employee.js";

const Employee = mongoose.model("employee", employee);

class EmployeeServices{

    SelectAll(){
        return Employee.find();
    }

    SelectOne(id){
        return Employee.findOne({_id: id});
    }

    CreateUser(employeeName, employeeEmail, employeePassword, employeePicture, employeeAccessLevel, companyCode){
        //criar com elementos necessarios como hash nas senhas
    }

    Update(id, employeeName, employeeEmail, employeePassword, employeePicture, employeeAccessLevel){
        Employee.findByIdAndUpdate(id,{
            employeeName: employeeName,
            employeeEmail: employeeEmail,
            employeePassword: employeePassword,
            employeePicture: employeePicture,
            employeeAccessLevel: employeeAccessLevel
        }).then(() => {
            console.log("funcionario " + employeeName + " atualizado com sucesso!");
        }).catch(err =>{
            console.log(err);
        });
    }

    Delete(id){
        Employee.findByIdAndDelete(id).then(() => {
            console.log("cliente " + id + " deletado com sucesso!");
        }).catch(err =>{
            console.log(err);
        });
    }
}

export default new EmployeeServices();
