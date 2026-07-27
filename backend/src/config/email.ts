import { Resend } from 'resend';
import { config } from './app';

export const resend = new Resend(config.email.apiKey);
