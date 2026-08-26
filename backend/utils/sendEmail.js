const nodemailer = require("nodemailer");
const dns = require("dns");

// Force IPv4 first DNS resolution on Node 18+ to prevent ENETUNREACH IPv6 errors on cloud hosts like Render
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
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use STARTTLS on port 587 (unblocked on cloud hosts)
            requireTLS: true,
            family: 4, // Force IPv4 socket connection
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