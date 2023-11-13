import { Webhook } from 'discord-webhook-node';
import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();
export const webhook = new Webhook(process.env.DISCORD_WEBHOOK_URL);

export const signupWebhook = new Webhook(process.env.DISCORD_SIGNUP_URL);

export const uploadWebhook = new Webhook(process.env.DISCORD_UPLOAD_URL);

export const socketWebhook = new Webhook(process.env.DISCORD_SOCKET_URL);

export const apiErrorWebhook = new Webhook(process.env.DISCORD_API_ERROR_URL);

export const socketErrorWebhook = new Webhook(
  process.env.DISCORD_SOCKET_ERROR_URL,
);
