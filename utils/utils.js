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
}

export default new Utils();