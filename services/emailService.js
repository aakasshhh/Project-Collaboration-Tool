const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  initializeTransporter() {
    if (this.transporter) return;

    console.log('Initializing email service...');
    console.log('USERNAME:', process.env.EMAIL_USERNAME ? 'Set' : 'Not set');
    console.log('SERVER:', process.env.EMAIL_SERVER);
    console.log('PORT:', process.env.EMAIL_PORT);

    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
      console.log('EMAIL_USERNAME or EMAIL_PASSWORD not configured - email service disabled');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    console.log('Email Transporter created successfully');
  }

  async testConnection() {
    this.initializeTransporter();

    if (!this.transporter) {
      return {
        success: false,
        error: 'Email service not configured - check EMAIL_USERNAME and EMAIL_PASSWORD in .env'
      };
    }

    try {
      await this.transporter.verify();
      return {
        success: true,
        message: 'Email service connection successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendEmail({ to, subject, html, text }) {
    this.initializeTransporter();

    if (!this.transporter) {
      console.log('Email service not configured - skipping email send');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'Project Collaboration Team <quantamcoders@gmail.com>',
        to,
        subject,
        html,
        text
      });
      return { success: true };
    } catch (error) {
      console.error('Email send failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  baseTemplate(title, content) {
    return `
      <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #4f46e5, #3b82f6); padding: 20px; color: #ffffff;">
            <h1 style="margin: 0; font-size: 22px; font-weight: bold;">${title}</h1>
          </div>
          <div style="padding: 20px; color: #333333; font-size: 15px; line-height: 1.6;">
            ${content}
          </div>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            This is an automated message, please do not reply.
          </div>
        </div>
      </div>
    `;
  }

  async sendWelcomeEmail(email, name) {
    const content = `
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for joining our project collaboration platform. We're excited to have you on board!</p>
      <ul>
        <li>Create and manage projects</li>
        <li>Assign tasks to team members</li>
        <li>Track project progress</li>
        <li>Collaborate with your team</li>
      </ul>
      <p>Best regards,<br><strong>The Project Collaboration Team</strong></p>
    `;

    return await this.sendEmail({
      to: email,
      subject: 'Welcome to Project Collaboration Tool!',
      html: this.baseTemplate('Welcome to Project Collaboration Tool!', content)
    });
  }

  async sendTaskAssignmentEmail(email, userName, taskTitle, projectName) {
    const content = `
      <p>Hi <strong>${userName}</strong>,</p>
      <p>You have been assigned a new task:</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #1f2937;">${taskTitle}</h3>
        <p style="margin: 0; color: #6b7280;">Project: ${projectName}</p>
      </div>
      <p>Please log in to your dashboard to view the task details and get started.</p>
      <p>Best regards,<br><strong>The Project Collaboration Team</strong></p>
    `;

    return await this.sendEmail({
      to: email,
      subject: `New Task Assigned: ${taskTitle}`,
      html: this.baseTemplate('New Task Assigned', content)
    });
  }

  async sendTaskStatusUpdateEmail(email, userName, taskTitle, newStatus) {
    const content = `
      <p>Hi <strong>${userName}</strong>,</p>
      <p>The status of your task has been updated:</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #1f2937;">${taskTitle}</h3>
        <p style="margin: 0; color: #6b7280;">New Status: <strong>${newStatus}</strong></p>
      </div>
      <p>Please log in to your dashboard to view the updated task details.</p>
      <p>Best regards,<br><strong>The Project Collaboration Team</strong></p>
    `;

    return await this.sendEmail({
      to: email,
      subject: `Task Status Updated: ${taskTitle}`,
      html: this.baseTemplate('Task Status Updated', content)
    });
  }
}

module.exports = new EmailService();