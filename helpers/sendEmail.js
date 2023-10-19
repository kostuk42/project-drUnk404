const nodemailer = require('nodemailer');

require('dotenv').config();
const {META_PASSWORD} = process.env;

const nodeMailerConfig = {
    host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
        user: 'alexey.kostiuchenko@meta.ua',
        pass: META_PASSWORD,
    }
}

const transport = nodemailer.createTransport(nodeMailerConfig);

const sendEmail = async (data) => {
    const email = {...data, from: 'alexey.kostiuchenko@meta.ua' }
    await transport.sendMail(email);
    return true
}

module.exports = sendEmail

// transport.sendMail(mailOptions).then((info) => {
//     console.log(info)
// }).catch((err) => {
//     console.log(err)
// })
