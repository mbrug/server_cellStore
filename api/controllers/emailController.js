'use strict';
const nodemailer = require('nodemailer');

class Mailer {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USERNAME, // generated ethereal user
                pass: process.env.MAIL_PASSWORD // generated ethereal password
            }
        });
    }

    sendMail(mailOptions) {
    //     this.transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         return console.log('error to send email', error)
    //     }
    //     console.log('Message sent: %s', info.messageId);
 
    //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    //    });
        return this.transporter.sendMail(mailOptions);
    }

}

module.exports = new Mailer()
