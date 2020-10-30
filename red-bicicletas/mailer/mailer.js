
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const sgMail  = require('@sendgrid/mail');

let mailConfig;
if(process.env.NODE_ENV === 'production'){
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_SECRET
        }
    }
    mailConfig = sgTransport(options);
}else{
    if(process.env.NODE_ENV === 'staging'){
        const options= {
            auth: {
                api_key: process.env.SENDGRID_API_SECRET
            }
        }
        mailConfig = sgTransport(options);
    }else{
        //todos los correos se envian por ethereal.email
        mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ETHEREAL_USER,
                pass: process.env.ETHEREAL_PWD
            }
        };        
    }
} 

module.exports = nodemailer.createTransport(mailConfig);