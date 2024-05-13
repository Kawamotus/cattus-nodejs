import mongoose from "mongoose";
import bcryt from "bcrypt"

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

employee.pre('save', async function(next) {
    const hash = await bcryt.hash(this.employeePassword, 10)
    this.employeePassword = hash
  })

export default employee;
