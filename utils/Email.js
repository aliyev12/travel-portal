/* eslint-disable */
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url, service = process.env.EMAIL_SERVICE) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Travel Portal <${process.env.EMAIL_FROM}>`;
    this.service = service;
  }

  newTransport() {
    // if (process.env.NODE_ENV === 'production') {

    /*==========*/
    /* SENDGRID */
    /*==========*/
    if (this.service === 'sendgrid') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    } 
    
    /*=======*/
    /* GMAIL */
    /*=======*/
    else if (this.service === 'gmail') {
      // !!! MAKE SURE TO Activate Gmail "less secure appS" option!
      return nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASSWORD
        }
      });
    } 

    /*==========*/
    /* MAILTRAP */
    /*==========*/
    else if (this.service === 'mailtrap') {
      return nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD
        }
      });
    } 

    /*======================*/
    /* OTHER - UNRECOGNIZED */
    /*======================*/
    else {
      // If there is no EMAIL_SERVICE env variable, then throw an error
      throw new Error(
        'Email service has not been specified in environmental variables.'
      );
    }
  }

  async send(template, subject) {
    // Send the actual email
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };
    
    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Travel Portal Family!');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes!)');
  }
};
