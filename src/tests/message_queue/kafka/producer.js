const { Kafka, logLevel } = require("kafkajs");

const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["kafka-server:9092", "kafka-server:9093", "kafka-server:9094"],
    logLevel: logLevel.ERROR,
});

const producer = kafka.producer();

const runProducer = async () => {
    await producer.connect();
    await producer.send({
        topic: "test-topic",
        messages: [{ value: "Hello KafkaJS user by ArthurJS!" }],
    });

    await producer.disconnect();
};

runProducer().catch(console.error);
