import mongoose from "mongoose";
import employee from "../models/employee.js";

const Employee = mongoose.model("employee", employee);

class EmployeeServices{

    SelectAll(){
        return Employee.find().populate("company");
    }

    SelectOne(id){
        return Employee.findById(id).populate("company");
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
