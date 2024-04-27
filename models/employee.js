import mongoose from "mongoose";

const employee = new mongoose.Schema({
    employeeName: String,
    employeeEmail: String,
    employeePassword: String,
    employeePicture: String,
    employeeAccessLevel: Number,
    companyCode: String
});

export default employee;
