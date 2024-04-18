import mongoose from "mongoose";

const employee = mongoose.Schema({
    employeeName: String,
    employeeEmail: String,
    employeePassword: String,
    employeePicture: String,
    employeeAccessLevel: Number,
    companyCode: String
});

export default employee;
