import { Webhook } from 'discord-webhook-node';
import * as process from 'process';
import * as dotenv from 'dotenv';

dotenv.config();
export const webhook = new Webhook(process.env.DISCORD_WEBHOOK_URL);
export const studentWebhook = new Webhook(process.env.DISCORD_STUDENT_URL);
export const teacherWebhook = new Webhook(process.env.DISCORD_TEACHER_URL);
