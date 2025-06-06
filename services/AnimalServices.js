import mongoose from "mongoose";
import animal from "../models/animal.js";
import utils from "../utils/utils.js";

const Animal = mongoose.model("Animal", animal);

class AnimalServices{

    SelectAll(company, skip = 0, limit = 10){
        return Animal.find({company: company}).populate("company").populate("lastEditedBy").skip(skip).limit(limit)
    }

    SelectAllByFields(company, filter) {
        return Animal.find({company: company}).populate("company").populate("lastEditedBy").find(filter)
    }

    SelectOne(id){
        return Animal.findById(id).populate("company").populate("lastEditedBy");
    }

    SelectSickAnimals(company) {
        company = new mongoose.Types.ObjectId(company)
        return Animal.aggregate(utils.pipelineSickAnimals(company))
  }
  
    SelectTotalAnimals(company) {
        company = new mongoose.Types.ObjectId(company)
        return Animal.aggregate(utils.pipelineTotalAnimals(company))
    }

    Create(data){
        const newAnimal = new Animal(data);
        return newAnimal.save()
    }

    Delete(id){
        return Animal.findByIdAndDelete(id)
    }

    Update(id, data){
        return Animal.findByIdAndUpdate(id, {$set: data})
    }
}

export default new AnimalServices();
