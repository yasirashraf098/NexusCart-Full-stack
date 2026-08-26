const nodemailer = require("nodemailer");

const createTransporter = () => {
    const user = (process.env.EMAIL_USER || "").trim();
    const pass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

    if (!user || !pass) {
        console.error("CRITICAL EMAIL CONFIG ERROR: EMAIL_USER or EMAIL_PASS environment variable is NOT set!");
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass }
    });
};

const sendEmail = async (to, subject, text, html = null) => {
    try {
        const user = (process.env.EMAIL_USER || "").trim();
        if (!user) {
            throw new Error("EMAIL_USER environment variable is missing.");
        }

        const transporter = createTransporter();

        const mailOptions = {
            from: `"NexusCart" <${user}>`,
            to: (to || "").trim(),
            subject,
            text,
            ...(html ? { html } : {})
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}. MessageId: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("Error sending email:", error.message || error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = { sendEmail };