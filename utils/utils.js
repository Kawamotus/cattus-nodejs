import jwt from "jsonwebtoken"

class Utils {
    generateToken(employee) {
        return jwt.sign({
            id: employee._id,
            name: employee.employeeName,
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
}

export default new Utils();