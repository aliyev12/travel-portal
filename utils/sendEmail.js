const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  let transporter;
  if (process.env.EMAIL_SERVICE === 'gmail') {
    // !!! MAKE SURE TO Activate Gmail "less secure appS" option!
    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
      }
    });
  } else if (process.env.EMAIL_SERVICE === 'mailtrap') {
    transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD
      }
    });
  } else {
    // If there is no EMAIL_SERVICE env variable, then throw an error
    throw new Error(
      'Email service has not been specified in environmental variables.'
    );
  }
console.log('options.message = ', options.message);
  // 2) Define the email options
  const mailOptions = {
    from: options.from || 'App App <app@app.com>',
    to: options.to,
    subject: options.subject,
    text: options.message
    // html: TODO -> Specify html later...
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
