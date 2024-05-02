import mongoose from "mongoose";

const employee = new mongoose.Schema({
    employeeName: String,
    employeeEmail: String,
    employeePassword: String,
    employeePicture: String,
    employeeAccessLevel: Number,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', //id da empresa de origem do funcionario
        require: true
    }
});

export default employee;
