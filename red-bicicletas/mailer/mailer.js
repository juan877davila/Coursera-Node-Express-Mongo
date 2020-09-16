var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'donnell.sauer@ethereal.email',
        pass: 'TK98gg1T7yUtusv1nS'
    }
});

module.exports = transporter;