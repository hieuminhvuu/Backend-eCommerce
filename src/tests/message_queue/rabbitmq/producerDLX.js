const amqp = require("amqplib");
const messages = "Hello, RabbiMQ for ArthurJS!";

const runProducer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:guest@localhost");
        const channel = await connection.createChannel();

        const notificationExchange = "notificationEx"; // notificationEx direct
        const notiQueue = "notificationQueueProcess"; // assertQueue
        const notificationExchangeDLX = "notificationExDLX"; // notificationEx direct
        const notificationRoutingKeyDLX = "notificationRoutingDLX"; // assert

        // 1.create Exchange
        await channel.assertExchange(notificationExchange, "direct", {
            durable: true,
        });

        // 2. create Queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, //cho phep cac ket noi truy cap vao cung 1 luc cac hang doi
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX,
        });

        // 3. bindQueue
        await channel.bindQueue(queueResult.queue, notificationExchange);

        // 4. send message
        const msg = "a new product";
        console.log(`producer msg::`, msg);
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: "10000",
        });

        await setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error(error);
    }
};

runProducer().catch(console.error);
