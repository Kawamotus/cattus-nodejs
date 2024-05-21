import mongoose from "mongoose";

const animal = new mongoose.Schema({
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
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', //id da empresa de origem do pet
        require: true
    },
    petPicture: String,
    petStatus: {
        petCurrentStatus: String,
        petCriticalQuantity: Number,
        petLastOccurrence: Date
    }
});

export default animal;