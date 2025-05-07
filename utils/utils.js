import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AWS from "@aws-sdk/client-s3";

dotenv.config();

const s3 = new AWS.S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

class Utils {
  generateToken(employee) {
    return jwt.sign(
      {
        id: employee._id,
        name: employee.employeeName,
        picture: employee.employeePicture,
        accessLevel: employee.employeeAccessLevel,
        companyName: employee.company.companyName,
        company: employee.company._id,
      },
      "gatinhos",
      { expiresIn: 36000 }
    );
  }

  generateSearchQuery(query, fields) {
    return {
      $or: fields.map((field) => {
        if (typeof field === "string") {
          return { [field]: { $regex: query, $options: "i" } };
        } else {
          const [nestedField, nestedKey] = field;
          return {
            [`${nestedField}.${nestedKey}`]: { $regex: query, $options: "i" },
          };
        }
      }),
    };
  }

  uploadPicture(file, file_name) {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: file_name,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new AWS.PutObjectCommand(params);

    return s3.send(command);
  }

  getUploadedPicture(file_name) {
    return `${process.env.BUCKET_OBJECT_URL}/${file_name}`;
  }

  unFlatten(data) {
    const result = {};
    for (const i in data) {
      const keys = i.split(".");
      keys.reduce((acc, key, index) => {
        return (acc[key] =
          acc[key] || (index === keys.length - 1 ? data[i] : {}));
      }, result);
    }
    return result;
  }

  async imageUrlToBase64(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString("base64");
      return `data:${response.headers.get(
        "content-type"
      )};base64,${base64Image}`;
    } catch (error) {
      console.error("Erro ao converter imagem em Base64:", error);
      throw error;
    }
  }

  buildUpdateFields(updates, prefix = "") {
    const updateFields = {};

    for (let key in updates) {
      const value = updates[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        Object.assign(updateFields, this.buildUpdateFields(value, newKey));
      } else {
        updateFields[newKey] = value;
      }
    }

    return updateFields;
  }

  nonObrigatoryAnimalsFields() {
    return {
      petFavorite: false,
      petVaccines: [],
      petCharacteristics: {
        petCastrated: "",
        petBreed: "",
      },
      petStatus: {
        petCurrentStatus: "",
        petOccurrencesQuantity: 0,
        petLastOccurrence: null,
      },
      physicalCharacteristics: {
        furColor: "",
        furLength: "",
        eyeColor: "",
        size: 0,
        weight: 0,
      },
      behavioralCharacteristics: {
        personality: "",
        activityLevel: "",
        socialBehavior: "",
        meow: "",
      },
      petComorbidities: "",
    };
  }

  pipelineAverageActivitiesTime(company, interval) {
    const matchStage = {
      "activityAuthor.company": company,
    };

    // Calcule a data de início com base no intervalo fornecido
    if (interval === "weekly") {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      matchStage.$or = [
        { "activityData.activityStart": { $gte: date } },
        { "activityData.activityEnd": { $gte: date } },
      ];
    } else if (interval === "monthly") {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      matchStage.$or = [
        { "activityData.activityStart": { $gte: date } },
        { "activityData.activityEnd": { $gte: date } },
      ];
    } else if (interval !== "all") {
      throw new Error(
        'Intervalo não suportado. Use "weekly", "monthly" ou "all".'
      );
    }

    return [
      {
        $lookup: {
          from: "animals",
          localField: "activityAuthor",
          foreignField: "_id",
          as: "activityAuthor",
        },
      },
      {
        $unwind: "$activityAuthor",
      },
      {
        $match: matchStage,
      },
      {
        $facet: {
          gatos: [
            {
              $group: {
                _id: {
                  activityName: { $toLower: "$activityData.activityName" },
                },
                avgActivityTime: {
                  $avg: {
                    $divide: [
                      {
                        $subtract: [
                          { $toDate: "$activityData.activityEnd" },
                          { $toDate: "$activityData.activityStart" },
                        ],
                      },
                      60000, // Convertendo milissegundos para minutos
                    ],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                activityName: "$_id.activityName",
                avgActivityTime: { $round: ["$avgActivityTime", 2] },
              },
            },
            { $sort: { activityName: 1 } },
          ],
        },
      },
    ];
  }

  pipelineSickAnimals(company) {
    return [
      {
        $match: {
          "petStatus.petCurrentStatus": {
            $in: ["0", "1", "2"],
          },
          company: company,
        },
      },
      {
        $group: {
          _id: {
            status: "$petStatus.petCurrentStatus",
            gender: "$petGender",
          },
          quantidade: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.status",
          total: { $sum: "$quantidade" },
          femea: {
            $sum: {
              $cond: [{ $eq: ["$_id.gender", "Fêmea"] }, "$quantidade", 0],
            },
          },
          macho: {
            $sum: {
              $cond: [{ $eq: ["$_id.gender", "Macho"] }, "$quantidade", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          total: 1,
          femea: 1,
          macho: 1,
        },
      },
      {
        $group: {
          _id: null,
          gatos: {
            $push: {
              status: "$status",
              total: "$total",
              femea: "$femea",
              macho: "$macho",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          gatos: 1,
        },
      },
    ];
  }

  pipelineTotalAnimals(company) {
    return [
      {
        $match: {
          company: company,
        },
      },
      {
        $group: {
          _id: "$petGender",
          quantidade: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantidade" },
          femea: {
            $sum: {
              $cond: [{ $eq: ["$_id", "Fêmea"] }, "$quantidade", 0],
            },
          },
          macho: {
            $sum: {
              $cond: [{ $eq: ["$_id", "Macho"] }, "$quantidade", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          gatos: {
            total: "$total",
            femea: "$femea",
            macho: "$macho",
          },
        },
      },
    ];
  }
}

export default new Utils();
