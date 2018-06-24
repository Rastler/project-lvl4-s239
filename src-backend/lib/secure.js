import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

export const secret = process.env.SECRET || '12345678';

export const encrypt = value => crypto.createHmac('sha256', secret)
  .update(value)
  .digest('hex');
