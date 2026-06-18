const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
    try {
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (!emailUser || !emailPass) {
            console.error('[Email] EMAIL_USER or EMAIL_PASS not set in environment!');
            return false;
        }

        // Trim any accidental whitespace (common issue when copy-pasting into Render env)
        const cleanUser = emailUser.trim();
        const cleanPass = emailPass.trim().replace(/\s/g, ''); // remove any spaces from app password

        console.log(`[Email] Attempting to send to: ${to}`);
        console.log(`[Email] Using account: ${cleanUser}`);
        console.log(`[Email] Pass length: ${cleanPass.length}`);

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: cleanUser,
                pass: cleanPass,
            },
        });

        const info = await transporter.sendMail({
            from: `"CampusCart" <${cleanUser}>`,
            to,
            subject,
            text,
        });

        console.log(`[Email] ✅ Sent to ${to} | MessageId: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('[Email] ❌ Send failed:', error.message);
        console.error('[Email] Error code:', error.code);
        console.error('[Email] Response:', error.response);
        return false;
    }
};

module.exports = { sendEmail };
