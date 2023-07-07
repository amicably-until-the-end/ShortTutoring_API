import { Webhook } from 'discord-webhook-node';
import * as process from 'process';
import * as dotenv from 'dotenv';

dotenv.config();
export const webhook = new Webhook(process.env.DISCORD_WEBHOOK_URL);
