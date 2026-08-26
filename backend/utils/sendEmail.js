const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
    const user = (process.env.EMAIL_USER || "").trim();
    const pass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

    if (!user || !pass) {
        console.error("CRITICAL EMAIL CONFIG ERROR: EMAIL_USER or EMAIL_PASS environment variable is NOT set!");
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: "gmail",
            connectionTimeout: 10000, // 10 sec connection timeout
            greetingTimeout: 5000,    // 5 sec greeting timeout
            socketTimeout: 15000,     // 15 sec socket timeout
            auth: { user, pass }
        });
    }
    return transporter;
};

const sendEmail = async (to, subject, text, html = null) => {
    try {
        const user = (process.env.EMAIL_USER || "").trim();
        if (!user) {
            throw new Error("EMAIL_USER environment variable is missing.");
        }

        const activeTransporter = getTransporter();

        const mailOptions = {
            from: `"NexusCart" <${user}>`,
            to: (to || "").trim(),
            subject,
            text,
            ...(html ? { html } : {})
        };

        const info = await activeTransporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}. MessageId: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("Error sending email:", error.message || error);
        transporter = null; // Reset transporter on error to re-authenticate next attempt
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = { sendEmail };