import mongoose from "mongoose";
import NotificationService from "../services/NotificationService.js";

export default async (database, client) => {
    const activitiesCollection = database.collection('activities');
    const stockCollection = database.collection('stocks');
    const animalsCollection = database.collection('animals');

    {
        const changeStreamActivities = activitiesCollection.watch();
        changeStreamActivities.on('change', async (change) => {
            const activity = change.fullDocument

            const notification = {
                notificationDate: Date.now(),
                notificationTarget: client.handshake.query.company,
                Targets: "Company",
                notificationOrigin: activity.activityAuthor,
                Origin: "Animal",
                notificationStatus: false,
                notificationDescription: activity.activityData.activityName
            }

            try {
                const { _id } = await NotificationService.Create(notification)
                const newNotification = await NotificationService.SelectOne(_id.toHexString())
                client.emit('notification', newNotification);

            } catch (error) {
                console.log("Erro ao emitir a notificação: " + error);
            }
        });
    }

    {
        const pipeline = [
            { $match: { "fullDocument.stockAmount": { $lt: 5 } } },
            { $project: { 'fullDocument._id': 1, 'fullDocument.stockProduct': 1, 'fullDocument.stockAmount': 1 } }
        ]

        const changeStreamStock = stockCollection.watch(pipeline, { fullDocument: 'updateLookup' })
        changeStreamStock.on('change', async change => {
            const activity = change.fullDocument
            const notification = {
                notificationDate: Date.now(),
                notificationTarget: client.handshake.query.company,
                Targets: "Company",
                notificationOrigin: activity._id,
                Origin: "Stock",
                notificationStatus: false,
                notificationDescription: `O estoque do produto ${activity.stockProduct} está baixo. Valor atual: ${activity.stockAmount}.`
            }
            try {
                const { _id } = await NotificationService.Create(notification)
                const newNotification = await NotificationService.SelectOne(_id.toHexString())
                client.emit('notification', newNotification);

            } catch (error) {
                console.log("Erro ao emitir a notificação: " + error);
            }
        })
    }
    {
        const company = client.handshake.query.company
        const pipeline = [
            {
                $match: {  
                    "fullDocument.petStatus.petCurrentStatus": {$in: ["1", "2"]}
                }
            },
            {
                $match: {
                    "fullDocument.company": new mongoose.Types.ObjectId(company)
                }
            },
            {
                $project: {
                    "fullDocument._id": 1, "fullDocument.petName": 1, "fullDocument.petStatus.petCurrentStatus": 1
                }
            }
        ]
        
        const whatStatusIs = (status) => {
            switch (status) {
                case "0":
                    return "Saudável"
                case "1":
                    return "Alerta"
                case "2":
                    return "Critíco"    
                default:
                    "Não especificado"
            }
        }

        const changeStreamAnimals = animalsCollection.watch(pipeline, {fullDocument: 'updateLookup'})
        changeStreamAnimals.on('change', async change => {
            const animal = change.fullDocument
            console.log(animal);
            const notification = {
                notificationDate: Date.now(),
                notificationTarget: company,
                Targets: "Company",
                notificationOrigin: animal._id,
                Origin: "Animal",
                notificationStatus: false,
                notificationDescription: `Status do animal ${animal.petName} mudou para ${whatStatusIs(animal.petStatus.petCurrentStatus)}.`
            }
            try {
                const { _id } = await NotificationService.Create(notification)
                const newNotification = await NotificationService.SelectOne(_id.toHexString())
                client.emit('notificationStatus', newNotification);

            } catch (error) {
                console.log("Erro ao emitir a notificação: " + error);
            }
        })


    }
    client.on("disconnect", async () => {
        console.log("Cattus WEB desconectado.");
    });
}