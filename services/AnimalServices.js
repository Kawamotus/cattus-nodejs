import mongoose from "mongoose";
import animal from "../models/animal.js";

const Animal = mongoose.model("Animal", animal);

class AnimalServices{

    SelectAll(company){
        return Animal.find({company: company}).populate("company")
    }

    SelectAllByFields(company, filter) {
        return Animal.find({company: company}).find(filter)
    }

    SelectOne(id){
        return Animal.findById(id).populate("company");
    }

    Create(data){
        //companyCode pegamos da sessao?
        const newAnimal = new Animal(data);
        return newAnimal.save()
    }

    Delete(id){
        return Animal.findByIdAndDelete(id)
    }

    Update(id, data){
        return Animal.findByIdAndUpdate(id, data)
    }
}

export default new AnimalServices();
