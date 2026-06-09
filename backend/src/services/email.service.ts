import nodemailer from 'nodemailer';

// Create a reusable transporter object
let transporter: nodemailer.Transporter;

async function initTransporter() {
  if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_USER !== 'your-email@gmail.com' && process.env.NODE_ENV !== 'test') {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Test email account created:', testAccount.user);
  }
}
initTransporter();

export const sendConfirmationEmail = async (to: string, data: any) => {
  if (!transporter) {
    console.error('Transporter not initialized');
    return;
  }

  const qrData = encodeURIComponent(`Reserva:${data.codigo}|Parque:${data.parkName}|Inicio:${data.fechaInicio}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;

  const mailOptions = {
    from: '"LuciMap" <noreply@lucimap.mx>',
    to,
    subject: 'Confirmación de Reserva - LuciMap 2026',
    html: `
      <div style="font-family: sans-serif; max-w-md: 600px; margin: 0 auto;">
        <h1 style="color: #1e3a8a;">¡Tu reserva está confirmada!</h1>
        <p>Hola, aquí tienes los detalles de tu reserva en el Festival de las Luciérnagas 2026:</p>
        <ul style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
          <li><strong>ID de Reserva:</strong> <span style="font-size: 0.9em; color: #4b5563;">${data.id}</span></li>
          <li><strong>Código de Acceso:</strong> <span style="font-size: 1.2em; color: #1e3a8a; font-weight: bold;">${data.codigo}</span></li>
          <li><strong>Parque:</strong> ${data.parkName}</li>
          <li><strong>Fecha de Inicio:</strong> ${new Date(data.fechaInicio).toLocaleDateString()}</li>
          <li><strong>Fecha de Fin:</strong> ${new Date(data.fechaFin).toLocaleDateString()}</li>
          <li><strong>Número de Personas:</strong> ${data.numPersonas}</li>
          <li><strong>Tipo de Estancia:</strong> ${data.tipo}</li>
        </ul>
        <div style="text-align: center; margin-top: 30px;">
          <p><strong>Tu Código QR de Acceso:</strong></p>
          <img src="${qrUrl}" alt="QR Code" width="200" height="200" />
        </div>
        <p>¡Esperamos que disfrutes de esta experiencia mágica!</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendCancellationEmail = async (to: string, data: any) => {
  if (!transporter) return;

  const mailOptions = {
    from: '"LuciMap" <noreply@lucimap.mx>',
    to,
    subject: 'Cancelación de Reserva - LuciMap 2026',
    html: `
      <div style="font-family: sans-serif;">
        <h1 style="color: #dc2626;">Reserva Cancelada</h1>
        <p>Te confirmamos que tu reserva para <strong>${data.parkName}</strong> ha sido cancelada exitosamente.</p>
        <p>Lamentamos que no puedas acompañarnos, ¡esperamos verte en el futuro!</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Cancellation email sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending cancellation email:', error);
  }
};
