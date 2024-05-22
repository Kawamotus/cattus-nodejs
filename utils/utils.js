import jwt from "jsonwebtoken"

class Utils {
    generateToken(employee) {
        return jwt.sign({
            id: employee._id,
            name: employee.employeeName,
            company: employee.company
        }, "gatinhos", { expiresIn: 3600 })
    }

    generateSearchQuery(query, fields) {
        return {
            $or: fields.map(field => ({
                [field]: { $regex: query, $options: 'i' }
            }))
        };
    };
}

export default new Utils();