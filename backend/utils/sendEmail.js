const nodemailer = require("nodemailer");
const dns = require("dns");

if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
}

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
            family: 4,
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
        console.log(`[EMAIL SUCCESS] Sent via Gmail Service to ${to}. MessageId: ${info.messageId}`);
        return { provider: "GmailService", ...info };
    } catch (error) {
        console.error(`[EMAIL ERROR] Failed sending to ${to}:`, error.message || error);
        transporter = null;
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

const sendEmailWithTimeout = (to, subject, text, html = null, timeoutMs = 3000) => {
    return Promise.race([
        sendEmail(to, subject, text, html),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`SMTP Timeout after ${timeoutMs}ms`)), timeoutMs)
        )
    ]);
};

module.exports = { sendEmail, sendEmailWithTimeout };