const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  
  static async sendPasswordReset(userEmail, resetToken) {
    try {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
  
      
      const msg = {
        to: userEmail,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL,
          name: 'Sadeck Notes'
        },
        subject: 'Redefinir sua senha - Sadeck Notes',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6B5CE7;">Redefinir sua senha</h2>
            <p>Você solicitou a redefinição de senha.</p>
            <a href="${resetLink}" 
               style="display: inline-block; padding: 14px 28px; background-color: #6B5CE7; 
                      color: white; text-decoration: none; border-radius: 5px;">
              Redefinir Senha
            </a>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
              Link: ${resetLink}
            </p>
            <p style="font-size: 12px; color: #999;">
              Este link expira em 1 hora.
            </p>
          </div>
        `
      };

      await sgMail.send(msg);
      
      console.log('✅ Email enviado com sucesso via SendGrid para:', userEmail);
      return { success: true };

    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      if (error.response) {
        console.error('Detalhes:', error.response.body);
      }
      return { success: false, error };
    }
  }
}

module.exports = EmailService;