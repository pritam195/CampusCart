const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
    try {
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS  
            }
        });

        
        const mailOptions = {
            from: `"CampusCart" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        };

        
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = { sendEmail };
