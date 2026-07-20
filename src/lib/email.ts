import nodemailer from 'nodemailer';

// Em produção, isso deve vir de variáveis de ambiente.
// Como estamos em ambiente de desenvolvimento/teste, usaremos um mock
// ou você pode colocar suas credenciais reais aqui.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    // Se não tivermos SMTP_HOST configurado de verdade, vamos apenas logar (mock)
    if (!process.env.SMTP_HOST) {
      console.log('--- MOCK EMAIL ENVIADO ---');
      console.log('Para:', to);
      console.log('Assunto:', subject);
      console.log('Conteúdo:', html);
      console.log('--------------------------');
      return true;
    }

    const info = await transporter.sendMail({
      from: '"Meu Barbeiro App" <noreply@barberpro.com>',
      to,
      subject,
      html,
    });
    
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return false;
  }
}
