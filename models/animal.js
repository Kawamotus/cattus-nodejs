import mongoose from "mongoose";

const animal = mongoose.Schema({
    petName: String,
    petBirth: Date,
    petEntry: Date,
    petGender: String,
    petCharacteristics: {
        petType: String,
        petBreed: String,
        petSize: String
    },
    petComorbidities: String,
    petObs: String,
    petVaccCard: String,
    companyCode: String //id da empresa de origem do pet
});

export default animal;