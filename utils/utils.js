import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import AWS from "@aws-sdk/client-s3"

dotenv.config()

const s3 = new AWS.S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: process.env.BUCKET_REGION
})

class Utils {
    generateToken(employee) {
        return jwt.sign({
            id: employee._id,
            name: employee.employeeName,
            picture: employee.employeePicture,
            accessLevel: employee.employeeAccessLevel,
            company: employee.company._id
        }, "gatinhos", { expiresIn: 3600 })
    }

    generateSearchQuery(query, fields) {
        return {
            $or: fields.map(field => {
                if (typeof field === 'string') {
                    return { [field]: { $regex: query, $options: 'i' } };
                } else {
                    const [nestedField, nestedKey] = field;
                    return { [`${nestedField}.${nestedKey}`]: { $regex: query, $options: 'i' } };
                }
            })
        };
    };

    uploadPicture(file, file_name) {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: file_name,
            Body: file.buffer,
            ContentType: file.mimetype
        }

        const command = new AWS.PutObjectCommand(params)

        return s3.send(command)
    }

    getUploadedPicture(file_name) {
        return `${process.env.BUCKET_OBJECT_URL}/${file_name}`
    }

    unFlatten(data) {
        const result = {};
        for (const i in data) {
            const keys = i.split('.');
            keys.reduce((acc, key, index) => {
                return acc[key] = acc[key] || (index === keys.length - 1 ? data[i] : {});
            }, result);
        }
        return result;
    };

    async imageUrlToBase64(imageUrl) {
        try {
            const response = await fetch(imageUrl);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Image = buffer.toString('base64');
            return `data:${response.headers.get('content-type')};base64,${base64Image}`;
        } catch (error) {
            console.error('Erro ao converter imagem em Base64:', error);
            throw error;
        }
    };

    buildUpdateFields(updates, prefix = '') {
        const updateFields = {};

        for (let key in updates) {
            const value = updates[key];
            const newKey = prefix ? `${prefix}.${key}` : key;

            if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                Object.assign(updateFields, this.buildUpdateFields(value, newKey));
            } else {
                updateFields[newKey] = value;
            }
        }

        return updateFields;
    };

    pipelineAverageActivitiesTime(company, interval) {
        const matchStage = {
            "activityAuthor.company": company
        };

        // Calcule a data de início com base no intervalo fornecido
        if (interval === 'weekly') {
            const date = new Date();
            date.setDate(date.getDate() - 7);
            matchStage.$or = [
                { "activityData.activityStart": { $gte: date } },
                { "activityData.activityEnd": { $gte: date } }
            ];
        } else if (interval === 'monthly') {
            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            matchStage.$or = [
                { "activityData.activityStart": { $gte: date } },
                { "activityData.activityEnd": { $gte: date } }
            ];
        } else if (interval !== 'all') {
            throw new Error('Intervalo não suportado. Use "weekly", "monthly" ou "all".');
        }

        return [
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
                $match: matchStage
            },
            {
                $facet: {
                    gatos: [
                        { $match: { "activityAuthor.petCharacteristics.petType": "Gato" } },
                        {
                            $group: {
                                _id: { activityName: { $toLower: "$activityData.activityName" } },
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
                                activityName: "$_id.activityName",
                                avgActivityTime: { $round: ["$avgActivityTime", 2] },
                            }
                        },
                        { $sort: { activityName: 1 } }
                    ],
                    cachorros: [
                        { $match: { "activityAuthor.petCharacteristics.petType": "Cachorro" } },
                        {
                            $group: {
                                _id: { activityName: { $toLower: "$activityData.activityName" } },
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
                                activityName: "$_id.activityName",
                                avgActivityTime: { $round: ["$avgActivityTime", 2] },
                            }
                        },
                        { $sort: { activityName: 1 } }
                    ]
                }
            }
        ]
    }

    pipelineSickAnimals(company) {
        return [
            {
                $match: {
                    $or: [
                        {
                            "petStatus.petCurrentStatus": "2"
                        },
                        {
                            "petStatus.petCurrentStatus": "1"
                        },
                        {
                            "petStatus.petCurrentStatus": "0"
                        }
                    ]
                }
            },
            {
                $match: {
                    company: company
                }
            },
            {
                $facet: {
                    gatos: [
                        {
                            $match: {
                                "petCharacteristics.petType": "Gato"
                            }
                        },
                        {
                            $group: {
                                _id: "$petStatus.petCurrentStatus",
                                count: {
                                    $sum: 1
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                status: "$_id",
                                quantidade: "$count"
                            }
                        }
                    ],
                    cachorros: [
                        {
                            $match: {
                                "petCharacteristics.petType":
                                    "Cachorro"
                            }
                        },
                        {
                            $group: {
                                _id: "$petStatus.petCurrentStatus",
                                count: {
                                    $sum: 1
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                status: "$_id",
                                quantidade: "$count"
                            }
                        }
                    ]
                },
            },
        ]
    }

    pipelineTotalAnimals(company) {
        return [
            {
                $match: {
                    company: company,
                }
            },
            {
                $facet: {
                    cachorro: [
                        {
                            $match: {
                                'petCharacteristics.petType': 'Cachorro'
                            }
                        }, {
                            $group: {
                                _id: '$petCharacteristics.petType',
                                count: {
                                    $sum: 1
                                }
                            }
                        }, {
                            $project: {
                                _id: 0
                            }
                        }
                    ],
                    gato: [
                        {
                            $match: {
                                'petCharacteristics.petType': 'Gato'
                            }
                        }, {
                            $group: {
                                _id: '$petCharacteristics.petType',
                                count: {
                                    $sum: 1
                                }
                            }
                        }, {
                            $project: {
                                _id: 0
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                  cachorro: {                    
                      $ifNull: [
                        {
                          $arrayElemAt: ["$cachorro.count", 0]
                        },
                        0
                      ]
                    },
                    gato: {
                      $ifNull: [
                        {
                          $arrayElemAt: ["$gato.count", 0]
                        },
                        0
                      ]
                    }
           
                }
              }
        ]
    }
}

export default new Utils();