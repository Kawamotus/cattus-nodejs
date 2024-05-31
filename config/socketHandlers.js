import NotificationService from "../services/NotificationService.js";

export default async (database, client) => {
    const animalCollection = database.collection('activities');
    const stockCollection = database.collection('stocks');

    {
        const changeStreamAnimal = animalCollection.watch();
        changeStreamAnimal.on('change', async (change) => {
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
    client.on("disconnect", async () => {
        console.log("Cattus WEB desconectado.");
    });
}