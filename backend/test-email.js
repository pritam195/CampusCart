require('dotenv').config();
const nodemailer = require('nodemailer');

async function test() {
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'NOT SET');

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        console.log('\nVerifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection OK!');

        console.log('\nSending test email...');
        const info = await transporter.sendMail({
            from: `"CampusCart Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'CampusCart SMTP Test',
            text: 'If you see this, Gmail SMTP is working correctly!',
        });
        console.log('✅ Email sent! MessageId:', info.messageId);
    } catch (err) {
        console.error('\n❌ ERROR:', err.message);
        console.error('Full error:', err);
    }
}

test();
