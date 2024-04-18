import mongoose from "mongoose";
import employee from "../models/employee.js";

const Employee = mongoose.model("employee", employee);

class EmployeeServices{

}

export default new EmployeeServices();
