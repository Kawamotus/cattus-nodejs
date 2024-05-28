import jwt from "jsonwebtoken"

class Middlewares {
    checkNecessaryFields(model) {
      return function (req, res, next) {
        const data = JSON.stringify(req.body);
            const baseModel = Object.keys(model.paths).slice(0, -2);        
        
            let errorsList = []
            for (const field of baseModel) {
                const splitedField = field.split(".")
                if(splitedField[1]){
                    if (!data.includes(splitedField[1])) {
                        errorsList.push(`Campo '${splitedField[1]}' é necessário.`)
                    }
                } else if (!data.includes(field)) {
                  if ((field == "employeePicture" ||
                        field == "petPicture" ||
                        field == "companyLogo" ||
                        field == "petVaccCard")
                    && req.files) continue
                    errorsList.push(`Campo '${field}' é necessário.`)
                }
            }
    
            if(errorsList.length > 0) return res.status(400).send({erros: errorsList})
    
            next();
        };
    }

    authenticate(req, res, next) {
        const authHeader = req.headers.authorization

        if(!authHeader){
            return res.status(401).send({message: 'Um token não foi fornecido.'})
        }
            
        jwt.verify(authHeader, "gatinhos", (err, decoded) => {
            if(err){
                console.log(err);                
                return res.status(500).send({message: 'Erro ao autenticar o token'})    
            }
            
            req.session.user = decoded
            next()
        })
    }
}

export default new Middlewares();