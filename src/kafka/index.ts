import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "car-rental-service-v1.0",
  brokers: [process.env.KAFKA_BROKER!],
  
  connectionTimeout: 3000,
  requestTimeout: 25000,

});
