const { Resend } = require('resend');

const sendEmail = async ({ to, subject, text }) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error('[Email] RESEND_API_KEY is not set in environment!');
            return false;
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: 'CampusCart <onboarding@resend.dev>',
            to,
            subject,
            text,
        });

        if (error) {
            console.error('[Email] ❌ Resend error:', error);
            return false;
        }

        console.log(`[Email] ✅ Sent to ${to} | ID: ${data.id}`);
        return true;
    } catch (error) {
        console.error('[Email] ❌ Send failed:', error.message);
        return false;
    }
};

module.exports = { sendEmail };
