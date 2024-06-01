import mongoose from "mongoose";
import employee from "../models/employee.js";

const Employee = mongoose.model("employee", employee);

class EmployeeServices{

    SelectAll(id, skip = 0, limit = 10){
        return Employee.find({company: id}).populate("company").skip(skip).limit(limit);
    }

    SelectOne(id){
        return Employee.findById(id).populate("company");
    }

    SelectOneByEmail(email) {
        return Employee.findOne({employeeEmail: email}).populate("company");
    }

    Create(data){
        const newUser = new Employee(data);
        return newUser.save();
    }

    Update(id, data){
        return Employee.findByIdAndUpdate(id, data)
    }

    Delete(id){
        return Employee.findByIdAndDelete(id)
    }
}

export default new EmployeeServices();
