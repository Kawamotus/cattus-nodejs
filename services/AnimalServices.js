import mongoose from "mongoose";
import animal from "../models/animal.js";

const Animal = mongoose.model("animal", animal);

class AnimalServices{

    SelectAll(){
        return Animal.find();
    }

    SelectOne(id){
        return Animal.findOne({_id: id});
    }

    Create(petName, petBirth, petEntry, petGender, petType, petBreed, petSize, petComorbidities, petObs, petVaccCard, companyCode){
        //companyCode pegamos da sessao?
        const newAnimal = new Animal({
            petName: petName,
            petBirth: petBirth,
            petEntry: petEntry,
            petGender: petGender,
            petCharacteristics:{
                petType: petType,
                petBreed: petBreed,
                petSize: petSize
            },
            petComorbidities: petComorbidities,
            petObs: petObs,
            petVaccCard: petVaccCard,
            companyCode: companyCode
        });
        newAnimal.save();
    }

    Delete(id){
        Animal.findByIdAndDelete(id).then(()=>{
            console.log("Animal " + id + " deletado com sucesso!");
        }).catch(err =>{
            console.log(err);
        });
    }

    Update(id, petName, petBirth, petEntry, petGender, petType, petBreed, petSize, petComorbidities, petObs, petVaccCard){
        Animal.findByIdAndUpdate(id, {
            petName: petName,
            petBirth: petBirth,
            petEntry: petEntry,
            petGender: petGender,
            petCharacteristics:{
                petType: petType,
                petBreed: petBreed,
                petSize: petSize
            },
            petComorbidities: petComorbidities,
            petObs: petObs,
            petVaccCard: petVaccCard,
        }).then(() => {
            console.log("Animal "+ petName + " atualizado com sucesso!");
        }).catch(err =>{
            console.log(err);
        });
    }
}

export default new AnimalServices();
