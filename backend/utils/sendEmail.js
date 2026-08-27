const nodemailer = require("nodemailer");
const dns = require("dns");

// Force IPv4 DNS resolution on Node 18+ for cloud hosting compatibility
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
}

let transporter = null;

const getTransporter = () => {
    const host = (process.env.EMAIL_HOST || process.env.SMTP_HOST || "smtp.gmail.com").trim();
    const port = Number(process.env.EMAIL_PORT || process.env.SMTP_PORT || 587);
    const user = (process.env.EMAIL_USER || "").trim();
    const pass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

    if (!user || !pass) {
        console.error("CRITICAL EMAIL CONFIG ERROR: EMAIL_USER or EMAIL_PASS environment variable is NOT set!");
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: port === 465,
            requireTLS: port !== 465,
            family: 4,
            connectionTimeout: 10000,
            greetingTimeout: 5000,
            socketTimeout: 15000,
            auth: { user, pass },
            tls: {
                rejectUnauthorized: false
            }
        });
    }
    return transporter;
};

const sendEmail = async (to, subject, text, html = null) => {
    // Primary direct Gmail SMTP delivery (Fast ~300ms, no 12s Resend 403 API delays)
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
        console.log(`[EMAIL SUCCESS] Sent via SMTP to ${to}. MessageId: ${info.messageId}`);
        return { provider: "SMTP", ...info };
    } catch (error) {
        console.error(`[EMAIL ERROR] Failed sending via SMTP to ${to}:`, error.message || error);
        transporter = null;
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = { sendEmail };