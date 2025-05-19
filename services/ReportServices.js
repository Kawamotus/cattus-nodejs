import PdfPrinter from 'pdfmake';
import utils from '../utils/utils.js';
import dotenv from 'dotenv';

dotenv.config();

class ReportServices {
  async ReportSingleAnimal(activities, author, options) {
    const body = [];
    const petPicture = await utils.imageUrlToBase64(author.petPicture);
    const cattusPicture = await utils.imageUrlToBase64(
      `${process.env.BUCKET_OBJECT_URL}/cattus.png`,
    );

    if (!Array.isArray(activities)) {
      throw new Error('A resposta da API não contém um array de atividades.');
    }

    for (let activity of activities) {
      if (activity.activityData) {
        const rows = [];
        rows.push(activity.activityData.activityName);
        rows.push(
          `${activity.activityData.activityStart
            .toJSON()
            .slice(0, 10)} / ${activity.activityData.activityStart
            .toJSON()
            .slice(11, 19)}`,
        );
        rows.push(
          `${activity.activityData.activityEnd
            .toJSON()
            .slice(0, 10)} / ${activity.activityData.activityEnd
            .toJSON()
            .slice(11, 19)}`,
        );

        body.push(rows);
      }
    }

    var fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };

    const printer = new PdfPrinter(fonts);
    const profileInformation = [
      {
        table: {
          body: [
            [
              {
                image: petPicture,
                width: 100,
              },
              {
                table: {
                  headerRows: 1,
                  body: [
                    [
                      {
                        text: `${author.petName}`,
                        colSpan: 2,
                        alignment: 'center',
                        style: 'columnsTitle',
                        marginTop: 2,
                        marginLeft: 10,
                        fillColor: '#3c8054',
                      },
                      {},
                    ],
                    [
                      {
                        text: `Nascimento: ${author.petBirth
                          .toJSON()
                          .slice(0, 10)}`,
                        marginLeft: 10,
                        marginRight: 60,
                        marginTop: 10,
                      },
                      {
                        text: `Vacinação: ${
                          author.petVaccCard ? 'Sim' : 'Não'
                        }`,
                        marginRight: 60,
                        marginTop: 10,
                      },
                    ],
                    [
                      {
                        text: `Comorbidades: ${author.petComorbidities}`,
                        colSpan: 2,
                        alignment: 'left',
                        marginLeft: 10,
                      },
                      {},
                    ],
                    [
                      {
                        text: `Observações: ${author.petObs}`,
                        colSpan: 2,
                        alignment: 'left',
                        marginLeft: 10,
                      },
                      {},
                    ],
                  ],
                },
                margin: [0, 0],
                layout: 'noBorders',
                fillColor: '#f1f1f1',
              },
            ],
          ],
        },
        layout: 'noBorders',
        widths: ['*'],
      },
    ];
    const statusInformation = [
      { text: '\n\n Status \n\n', style: 'SectionTitle' },
      { text: `Estado atual: ${author.petStatus.petCurrentStatus || 'N/A'}` },
      {
        text: `Alertas emitidos: ${
          author.petStatus.petOccurrencesQuantity || 0
        }`,
        marginTop: 5,
      },
      {
        text: `Último alerta: ${
          author.petStatus.petLastOccurrence
            ? author.petStatus.petLastOccurrence.toLocaleDateString()
            : 'N/A'
        }`,
        marginTop: 5,
      },
    ];
    const activitiesInformation = [
      { text: '\n\n Atividades na última semana: \n\n', style: 'SectionTitle' },
      body.length === 0
        ? [{ text: 'Não há atividades registradas', marginTop: 10 }]
        : [
            {
              table: {
                body: [
                  [
                    { text: 'Atividade', style: 'columnsTitle' },
                    { text: 'Início', style: 'columnsTitle' },
                    { text: 'Término', style: 'columnsTitle' },
                  ],
                  ...body,
                ],
              },
              layout: 'Layout1',
            },
          ],
    ];

    var myTableLayouts = {
      Layout1: {
        hLineWidth: function (i, node) {
          if (i === 0 || i === node.table.body.length) {
            return 0;
          }
          return i === node.table.headerRows ? 2 : 1;
        },
        fillColor: function (i) {
          if (i % 2) return '#3c8054';
          else return '#f1f1f1';
        },
        vLineWidth: function (i) {
          return 0;
        },
        hLineColor: function (i) {
          return (i = i % 2 ? 'black' : 'gray');
        },
        paddingLeft: function (i) {
          return i === 0 ? 0 : 100;
        },
      },
    };

    const docDefinition = {
      defaultStyle: { font: 'Helvetica' },
      content: [
        {
          columns: [
            {
              width: 330,
              text: 'Relatório de atividades\n',
              style: 'RepTitle',
            },
          ],
        },
        // PERFIL
        options.includes('profile')
          ? profileInformation
          : { text: '', marginTop: 10 },
        ,
        // STATUS
        options.includes('status')
          ? statusInformation
          : { text: '', marginTop: 10 },
        ,
        // ATIVIDADES
        options.includes('activities')
          ? activitiesInformation
          : { text: '', marginTop: 10 },
      ],

      // CABEÇALHO
      header: function () {
        return [
          {
            columns: [
              {
                width: 200,
                text: `\n${author.company.companyName}`,
                style: 'header',
                alignment: 'center',
              },
              {
                width: 200,
                text: `\n${author.company.companyCNPJ}`,
                style: 'header',
                alignment: 'center',
              },
              {
                width: 200,
                text: `\n${author.company.companyDetails.companyPhone}`,
                style: 'header',
                alignment: 'center',
              },
            ],
          },
          {
            canvas: [
              {
                type: 'line',
                x1: 35,
                y1: 5,
                x2: 635 - 2 * 40,
                y2: 5,
                lineWidth: 2,
              },
            ],
          },
        ];
      },

      // RODAPÉ
      footer: (currentPage, pageCount) => {
        var t = {
          layout: 'noBorders',
          fontSize: 10,
          margin: [30, 5, 0, 0],
          table: {
            widths: [200, '*', '*'],
            body: [
              [
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 5,
                      y1: 5,
                      x2: 605 - 2 * 40,
                      y2: 5,
                      lineWidth: 2,
                    },
                  ],
                  colSpan: 3,
                },
                {},
                {},
              ],
              [
                {
                  text:
                    'Página  ' + currentPage.toString() + ' de ' + pageCount,
                  margin: [5, 6],
                },
                {
                  image: cattusPicture,
                  width: 50,
                  margin: [22, 3],
                },
                {
                  text: `Relatório gerado em ${new Date().toLocaleDateString(
                    'pt-BR',
                  )} às ${new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`,
                  alignment: 'left',
                  margin: [0, 0, 70, 0],
                },
              ],
            ],
          },
        };

        return t;
      },
      styles: {
        RepTitle: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 5, -160, 0],
        },
        repTime: {
          fontsize: 12,
          alignment: 'right',
          margin: [0, 8, 0, 0],
        },
        SectionTitle: {
          fontSize: 16,
          bold: true,
        },
        header: {
          fontSize: 12,
          italics: true,
        },
        headerR: {
          alignment: 'right',
        },
        columnsTitle: {
          fontSize: 12,
          bold: true,
          italic: true,
        },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition, {
      tableLayouts: myTableLayouts,
    });
    return pdfDoc;
  }
}

export default new ReportServices();
