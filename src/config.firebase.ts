import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import * as process from 'process';

export const configFirebase = () => {
  initializeApp({
    credential: credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  });
};
