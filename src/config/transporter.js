import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config()
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou un autre service SMTP si nÃ©cessaire
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default transporter