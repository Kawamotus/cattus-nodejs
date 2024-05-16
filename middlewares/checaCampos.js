function verificarCamposNecessarios(modelo) {
    return function(req, res, next) {
        const dados = JSON.stringify(req.body);
        const camposNecessarios = Object.keys(modelo.paths).slice(0, -2);

        let erros = []
        for (const campo of camposNecessarios) {
            const splitCampoNecessario = campo.split(".")
            if(splitCampoNecessario[1]){
                if (!dados.includes(splitCampoNecessario[1])) {
                    erros.push(`Campo '${splitCampoNecessario[1]}' é necessário.`)
                }
            } else if (!dados.includes(campo)){
                erros.push(`Campo '${campo}' é necessário.`)
            }
        }

        if(erros.length > 0) return res.status(400).send({erros: erros})

        next();
    };
}

export default verificarCamposNecessarios