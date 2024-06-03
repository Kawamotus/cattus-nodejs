import mongoose from "mongoose";

const animal = new mongoose.Schema({
    petName: String,
    petBirth: Date,
    petEntry: Date,
    petGender: String,
    petCharacteristics: {
        petCastrated: String,
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
        petCurrentStatus: String, // Normal, alerta, agravante (critical)
        petOccurrencesQuantity: Number, // Qtde de vezes que o pet teve nível agravante
        petLastOccurrence: Date // Ultima ocorrencia do nivel agravante
    }
});

export default animal;