const axios = require('axios');

const sendEmail = async ({ to, subject, text }) => {
    try {
        if (!process.env.SENDGRID_API_KEY) {
            console.error('[Email] SENDGRID_API_KEY is not set in environment!');
            return false;
        }

        const response = await axios.post(
            'https://api.sendgrid.com/v3/mail/send',
            {
                personalizations: [{ to: [{ email: to }] }],
                from: {
                    email: process.env.EMAIL_USER, // must be verified in SendGrid
                    name: 'CampusCart',
                },
                subject,
                content: [{ type: 'text/plain', value: text }],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log(`[Email] ✅ Sent to ${to} | Status: ${response.status}`);
        return true;
    } catch (error) {
        const errMsg = error.response?.data?.errors?.[0]?.message || error.message;
        console.error('[Email] ❌ Send failed:', errMsg);
        return false;
    }
};

module.exports = { sendEmail };
