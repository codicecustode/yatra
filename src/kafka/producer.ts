import { kafka } from './index.js';
import { CompressionTypes } from 'kafkajs';

const EMAIL_TOPIC = 'email_otp';

let producer: any = null;

export const initProducer = async () => {
  if (producer) return; 
  
  producer = kafka.producer({
    allowAutoTopicCreation: false,
    idempotent: true, 
    maxInFlightRequests: 5,
    retry: {
      retries: 5,
      initialRetryTime: 300,
      maxRetryTime: 30000
    }
  });
  
  await producer.connect();

  producer.on('producer.connect', () => {
    console.log('Producer connected');
  });
  
  producer.on('producer.disconnect', () => {
    console.error('Producer disconnected');
  });
};

export const sendEmailJob = async (email: string, otp: string) => {
  if (!producer) {
    throw new Error('Producer not initialized');
  }
  
  try {
    const result = await producer.send({
      topic: EMAIL_TOPIC,
      acks: -1,
      timeout: 30000,
      compression: CompressionTypes.GZIP,
      messages: [
        {
          key: email,
          value: JSON.stringify({ email, otp }),
          timestamp: Date.now().toString()
        },
      ],
    });
    
    return result;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

export const disconnectProducer = async () => {
  if (producer) {
    await producer.disconnect();
    producer = null;
  }
};
