import mongoose from "mongoose";
import activity from "../models/activity.js";

const Activity = mongoose.model("activity", activity);

class ActivityServices {

    SelectAll(id) {
        return Activity.find({ activityAuthor: id }).populate("activityAuthor");
    }

    SelectAllNoCriteria() {
        return Activity.find();
    }

    SelectAverageActivitiesTime(company) {
        const pipeline = [
            {
                $lookup: {
                    from: "animals",
                    localField: "activityAuthor",
                    foreignField: "_id",
                    as: "activityAuthor"
                }
            },
            {
                $unwind: "$activityAuthor"
            },
            {
                $match: {
                    "activityAuthor.company": new mongoose.Types.ObjectId(company)
                }
            },
            {
                $group: {
                    _id: "$activityAuthor.petCharacteristics.petType",
                    avgActivityTime: {
                        $avg: {
                            $divide: [
                                {
                                    $subtract: [
                                        { $toDate: "$activityData.activityEnd" },
                                        { $toDate: "$activityData.activityStart" }
                                    ]
                                },
                                60000 // Convertendo milissegundos para minutos
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    petType: "$_id",
                    avgActivityTime: { $round: ["$avgActivityTime", 2] },
                    label: {
                        $cond: [
                            { $eq: ["$_id", "Gato"] },
                            "Atividade dos Gatos",
                            {
                                $cond: [
                                    { $eq: ["$_id", "Cachorro"] },
                                    "Atividade dos Cachorros",
                                    "Outro Tipo de Animal"
                                ]
                            }
                        ]
                    }
                }
            }
        ]


        return Activity.aggregate(pipeline)

    }

    SelectOne(id) {
        return Activity.findById(id).populate("activityAuthor");
    }

    Create(data) {
        const newActivity = new Activity(data);
        return newActivity.save()
    }

    Delete(id) {
        return Activity.findByIdAndDelete(id)
    }

}

export default new ActivityServices();
