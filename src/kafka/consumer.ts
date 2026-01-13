import { Consumer, EachMessagePayload } from 'kafkajs';
import { kafka } from './index.js';
import { sendOTPEmail } from '../services/mail.service';

const EMAIL_TOPIC = 'email_otp';

let consumer: Consumer | null = null;

export const initConsumer = async () => {
  if (consumer) return;
  
  consumer = kafka.consumer({
    groupId: 'email-processor-group', 
    heartbeatInterval: 3000,
    sessionTimeout: 30000,
    rebalanceTimeout: 60000,
    allowAutoTopicCreation: false,
    maxWaitTimeInMs: 5000,
    minBytes: 1,
    maxBytes: 1024 * 1024,
  });


  consumer.on(consumer.events.CONNECT, () => {
    console.log('Consumer connected');
  });
  consumer.on(consumer.events.CRASH, ({ payload }) => {
    console.error('Consumer crashed:', payload.error);
  });

  await consumer.connect();
  await consumer.subscribe({ 
      topic: EMAIL_TOPIC,
      fromBeginning: false 
  });

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      try {
        const { email, otp } = JSON.parse(message.value?.toString() || '{}');
        
        await sendOTPEmail(email, otp);
        
        console.log(`Processed email for ${email}`);
      } catch (error) {
        console.error(`Failed to process message:`, error);
        throw error;
      }
    },
  });
};
