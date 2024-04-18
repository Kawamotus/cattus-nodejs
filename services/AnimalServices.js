import mongoose from "mongoose";
import animal from "../models/animal.js";

const Animal = mongoose.model("animal", animal);

class AnimalServices{

}

export default new AnimalServices();
