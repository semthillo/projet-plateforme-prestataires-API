import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true', // Utilise SSL/TLS
      auth: {
        user: process.env.SMTP_USER, // Adresse e-mail de l'expéditeur
        pass: process.env.SMTP_PASSWORD, // Mot de passe de l'expéditeur
      },
    });
  }

  /**
   * Envoie un e-mail
   * @param {string} to - Adresse e-mail du destinataire
   * @param {string} subject - Sujet de l'e-mail
   * @param {string} text - Texte de l'e-mail
   * @param {string} html - Contenu HTML de l'e-mail
   */
  async sendEmail(to, subject, text, html) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        text,
        html,
      });

      console.log(`E-mail envoyé : ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('Erreur lors de l’envoi de l’e-mail :', error.message);
      throw new Error('Erreur lors de l’envoi de l’e-mail.');
    }
  }

  /**
   * Génère et envoie un lien de réinitialisation de mot de passe
   * @param {string} email - Adresse e-mail de l'utilisateur
   * @param {string} resetToken - Token de réinitialisation
   */
  async sendPasswordResetEmail(email, resetToken) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = 'Réinitialisation de votre mot de passe';
    const text = `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`;
    const html = `<p>Bonjour,</p>
                  <p>Vous avez demandé une réinitialisation de mot de passe.</p>
                  <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
                  <a href="${resetLink}">Réinitialiser mon mot de passe</a>
                  <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet e-mail.</p>`;

    return this.sendEmail(email, subject, text, html);
  }
}

export default new EmailService();
