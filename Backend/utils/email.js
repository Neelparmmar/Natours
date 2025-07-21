const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Neel <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      // 👉 SendGrid Transport for Production
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_KEY,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(templateFileName, subject) {
    // Load the HTML template and inject variables
    const templatePath = path.join(
      __dirname,
      'emailTemplates',
      `${templateFileName}.html`,
    );
    let html = fs.readFileSync(templatePath, 'utf-8');
    html = html
      .replace('{{firstName}}', this.firstName)
      .replace('{{url}}', this.url);

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    await this.createTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours!');
  }

  async sendPasswordReset() {
    await this.send(
      'resetPassword',
      'Your password reset token (valid for 10 min)',
    );
  }
}

module.exports = Email;
