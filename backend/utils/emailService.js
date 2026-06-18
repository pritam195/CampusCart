const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('[Email] EMAIL_USER or EMAIL_PASS not set in environment!');
            return false;
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"CampusCart" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });

        console.log(`[Email] Sent to ${to} | MessageId: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('[Email] Send failed:', error.message);
        return false;
    }
};

module.exports = { sendEmail };
