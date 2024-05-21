import express from "express";
import middlewares from "../middlewares/middlewares.js"

import AnimalServices from "../services/AnimalServices.js";
import ActivityServices from "../services/ActivityServices.js";

import PdfPrinter from "pdfmake"

const router = express.Router();

router.get("/animal/:animal_id", async (req,res) => {

    const activities = await ActivityServices.SelectAll(req.params.animal_id)
    const autor = await AnimalServices.SelectOne(req.params.animal_id)

    // console.log(autor.petStatus.petOccurrencesQuantity)
    // res.send({autor})

    const body = []

    if (!Array.isArray(activities)) {
        throw new Error("A resposta da API não contém um array de atividades.");
    }
    
    for (let activity of activities) {
            const rows = []
            rows.push(activity.activityData.activityName)
            rows.push(`${activity.activityData.activityStart.toJSON().slice(0,10)} / ${activity.activityData.activityStart.toJSON().slice(11,19)}`)
            rows.push(`${activity.activityData.activityStart.toJSON().slice(0,10)} / ${activity.activityData.activityStart.toJSON().slice(11,19)}`)
        
            body.push(rows)
    }

    let repDateTime = new Date().toJSON()
    let repDate = repDateTime.slice(0, 10)
    let repTime = repDateTime.slice(11, 19)

    var fonts = {
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
        }
    }

    const printer = new PdfPrinter(fonts)

    var myTableLayouts = {
        Layout1: {
          hLineWidth: function (i, node) {
            if (i === 0 || i === node.table.body.length) {
              return 0;
            }
            return (i === node.table.headerRows) ? 2 : 1;
          },
          fillColor: function(i) {
              if (i % 2)
                  return "#f75f60"
              else
                  return "#f1f1f1"
          },
          vLineWidth: function (i) {
            return 0;
          },
          hLineColor: function (i) {
            return i = i % 2 ? 'black' : 'gray';
          },
          paddingLeft: function (i) {
            return i === 0 ? 0 : 100;
          },
        //   paddingRight: function (i, node) {
        //     return (i === node.table.widths.length - 1) ? 0 : 51;
        //   },
        },
      }

    const docDefinition = {
        defaultStyle: {font: "Helvetica"},
        content: [
        {
            columns: [
                {width: 330, text: 'Relatório de atividades\n', style:"RepTitle"},
            ]
        },
// PERFIL
        { text: `${autor.petName}`, style:"SectionTitle"},
        {
            table: {
                body: [
                    [
                        {         
                        image: autor.petPicture,
                        width: 100
                        },
                        {
                            table: {
                                headerRows: 1,
                                body: [
                                    [ {text: `Animal_ID: ${autor._id}`, colSpan: 2, alignment: 'center', style: 'columnsTitle', marginTop: 2, marginLeft:10, fillColor: '#f75f60'}, {}],
                                    [ {text: `Tipo: ${autor.petCharacteristics.petType} `, marginLeft:10, marginTop: 5}, {text: `Raça: ${autor.petCharacteristics.petBreed}`, marginTop: 5}],
                                    [ {text: `Porte: ${autor.petCharacteristics.petSize}`, marginLeft:10}, {text: `Sexo: ${autor.petGender}`}],
                                    [ {text: `Nascimento: ${autor.petBirth.toJSON().slice(0,10)}`, marginLeft:10, marginRight:60}, {text: `Vacinação: ${autor.petVaccCard}`, marginRight:60}],
                                    [ {text:`Comorbidades: ${autor.petComorbidities}`, colSpan: 2, alignment: 'left', marginLeft:10}, {}],
                                    [ {text: `Observações: ${autor.petObs}`, colSpan: 2, alignment: 'left', marginLeft:10}, {}]
                                ]
                            },                           
                            margin: [0,0],
                            layout: 'noBorders',
                            fillColor: '#f1f1f1',
                        },    
                    ]
                ]
            },
            layout: 'noBorders',
            widths: ['*'],          
        },     
// STATUS 
        { text: "\n\n Status \n\n", style:"SectionTitle"},
        { text: `Estado atual: ${autor.petStatus.petCurrentStatus || 'N/A'}`, },
        { text: `Alertas emitidos: ${autor.petStatus.petOccurrencesQuantity || 0}`, marginTop:5},
        { text: `Último alerta: ${autor.petStatus.petLastOccurrence ? autor.petStatus.petLastOccurrence.toLocaleDateString() : 'N/A'}`, marginTop:5},

// ATIVIDADES
        { text: "\n\n Atividades na última semana: \n\n", style:"SectionTitle"},
            {
                table: {
                    body: [
                        [
                            {text: "Atividade", style: "columnsTitle"},
                            {text: "Início", style: "columnsTitle"},
                            {text: "Término", style: "columnsTitle"}
                        ],
                        ...body  
                    ]
            },
                layout: 'Layout1', 
            },
            

            { text: "\n\n Alimentação: \n\n", style:"SectionTitle"},
                "Grafico 1",

            { text: "\n\n Hidratação: \n\n", style:"SectionTitle"},
                "Grafico 2",

            { text: "\n\n Descanso: \n\n", style:"SectionTitle"},
                "Grafico 3",    

            { text: "\n\n Excreção / Defecação: \n\n", style:"SectionTitle"},
                "Grafico 4",
        ],

// CABEÇALHO
        header: function() {
            return [
                {
            columns: [
                {width: 200, text: `\n${autor.company.companyName}`, style:"header", alignment:'center'},
                {width: 200, text: `\n${autor.company.companyCNPJ}`, style:"header", alignment:'center'},
                {width: 200, text: `\n${autor.company.companyDetails.companyPhone}`, style:"header", alignment:'center'},
            ]
        }, 
        {canvas: [{ type: 'line', x1: 35, y1: 5, x2: 635-2*40, y2: 5, lineWidth: 2 }]}       
    ]
        },
        
// RODAPÉ
        footer: (currentPage, pageCount) => {
            var t = {
                layout: "noBorders",
                fontSize: 10,
                margin: [30, 5, 0, 0],
                table: {
                    widths: [200,'*', "*"], 
                    body: [
                        [{canvas: [{ type: 'line', x1: 5, y1: 5, x2: 605-2*40, y2: 5, lineWidth: 2 }], colSpan: 3},{},{}  ],
                        [
                        { text: "Página  " + currentPage.toString() + " de " + pageCount, margin: [5, 6] },
                        {
                            image: 'public/imgs/cattus.png',
                            width: 50,
                            margin: [22, 3]
                        },
                        {text: `${repDate} / ${repTime}`, margin: [22, 6]}
                        ]
                    ]
                },
                
            }
    
          return t
        },
        styles: {
            RepTitle: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 5, -160, 0]
            },
            repTime: {
                fontsize: 12,
                alignment: 'right',
                margin: [0, 8, 0, 0]
            },
            SectionTitle: {
                fontSize: 16,
                bold: true
            },
            header: {
                fontSize: 12,
                italics: true 
            },
            headerR: {
                alignment: 'right'
            },
            columnsTitle: {
                fontSize: 12,
                bold: true,
                italic: true
            }
    }
}

    const pdfDoc = printer.createPdfKitDocument(docDefinition, {tableLayouts: myTableLayouts})
    
    const chunks = []

    pdfDoc.on("data", (chunk) => {
        chunks.push(chunk)
    })


    pdfDoc.end()

    pdfDoc.on("end", () => {
        const result = Buffer.concat(chunks)
        res.end(result)
    })
    
})

export default router