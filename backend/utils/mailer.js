const nodemailer = require('nodemailer');

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}
async function sendMail({ to, subject, html }) {
  if (!process.env.EMAIL_USERNAME) return;
  const transporter = createTransport();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Project Collab <no-reply@example.com>',
    to,
    subject,
    html
  });
}

module.exports = { sendMail };