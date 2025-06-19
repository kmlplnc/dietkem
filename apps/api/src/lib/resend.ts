import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, code: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'E-posta Doğrulama Kodu - DietKem',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>DietKem E-posta Doğrulama</h2>
          <p>Merhaba,</p>
          <p>DietKem hesabınızı doğrulamak için aşağıdaki kodu kullanın:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
            <strong>${code}</strong>
          </div>
          <p>Bu kod 5 dakika süreyle geçerlidir.</p>
          <p>Bu e-postayı siz talep etmediyseniz, lütfen dikkate almayın.</p>
          <p>Saygılarımızla,<br>DietKem Ekibi</p>
        </div>
      `,
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}; 