const nodemailer = require('nodemailer');
const emailTemplates = require('../templates/email_template.js');

class EmailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendVerificationEmail(email, verificationCode) {
    const mailOptions = {
      from: `"DocuTrack" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your DocuTrack Account',
      html: emailTemplates.verificationEmail(email, verificationCode)
    };

    return this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailSender();