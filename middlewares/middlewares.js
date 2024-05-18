class Middlewares {
    checkNecessaryFields(model) {
        return function(req, res, next) {
            const data = JSON.stringify(req.body);
            const baseModel = Object.keys(model.paths).slice(0, -2);
    
            let errorsList = []
            for (const field of baseModel) {
                const splitedField = field.split(".")
                if(splitedField[1]){
                    if (!data.includes(splitedField[1])) {
                        errorsList.push(`Campo '${splitedField[1]}' é necessário.`)
                    }
                } else if (!data.includes(field)){
                    errorsList.push(`Campo '${field}' é necessário.`)
                }
            }
    
            if(errorsList.length > 0) return res.status(400).send({erros: errorsList})
    
            next();
        };
    }
}

export default new Middlewares()