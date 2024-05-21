import jwt from "jsonwebtoken"

class Utils {
    generateToken(employee) {
        return jwt.sign({
            id: employee._id,
            name: employee.employeeName,
            company: employee.company
        }, "gatinhos", { expiresIn: 3600000 })
    }
}

export default new Utils();