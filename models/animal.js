import mongoose from "mongoose";

const animal = new mongoose.Schema(
  {
    petName: String,
    petBirth: Date,
    petGender: String,
    petPicture: String,
    petObs: String,
    petFavorite: Boolean,
    petCharacteristics: {
      petCastrated: String,
      petBreed: String,
      petSize: String,
    },
    physicalCharacteristics: {
      furColor: {
        type: String,
        enum: ["", "preta", "branca", "cinza", "laranja", "marrom", "mesclada"],
      },
      furLength: { type: String, enum: ["", "curto", "médio", "longo"] },
      eyeColor: { type: String, enum: ["", "azul", "castanho", "verde"] },
      size: Number, // em cm
      weight: Number, // em kg
    },
    behavioralCharacteristics: {
      personality: {
        type: String,
        enum: ["","amigável", "reservado", "brincalhão", "independente", "arisco"],
      },
      activityLevel: { type: String, enum: ["", "ativo", "moderado", "calmo"] },
      socialBehavior: String, // ex: prefere humanos, gosta de outros gatos, interage bem com crianças
      meow: String, // ex: mia muito?, alto?
    },
    petComorbidities: String,
    petVaccines: Array,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      require: true,
    },
    petStatus: {
      petCurrentStatus: String, // ex: 0 Normal, 1 alerta,  2 grave
      petOccurrencesQuantity: Number,
      petLastOccurrence: Date,
      petStatusFood: {
        type: Number,
        enum: [0, 1, 2]
      },
      petStatusWater: {
        type: Number,
        enum: [0, 1, 2]
      },
      petStatusSleep: {
        type: Number,
        enum: [0, 1, 2]
      },
      petStatusNeeds: {
        type: Number,
        enum: [0, 1, 2]
      },
    },
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee"
    }
  },
  { timestamps: true }
);

export default animal;
