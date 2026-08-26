const nodemailer = require("nodemailer");
const dns = require("dns");

if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
}

let transporter = null;

const sendViaResend = async (to, subject, text, html, apiKey) => {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from: "NexusCart <onboarding@resend.dev>",
            to: [(to || "").trim()],
            subject: subject,
            text: text,
            html: html || `<p>${text}</p>`
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(`Resend API Error (${response.status}): ${data.message || JSON.stringify(data)}`);
    }
    console.log(`Email sent via Resend API to ${to}. ID: ${data.id}`);
    return { provider: "Resend", ...data };
};

const sendViaBrevo = async (to, subject, text, html, apiKey) => {
    const senderEmail = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : "noreply@nexuscart.com";

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": apiKey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sender: { name: "NexusCart", email: senderEmail },
            to: [{ email: (to || "").trim() }],
            subject: subject,
            textContent: text,
            htmlContent: html || `<p>${text}</p>`
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(`Brevo API Error (${response.status}): ${JSON.stringify(data)}`);
    }
    console.log(`Email sent via Brevo API to ${to}. MessageId: ${data.messageId}`);
    return { provider: "Brevo", ...data };
};

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
            secure: false,
            requireTLS: true,
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
    const resendKey = (process.env.RESEND_API_KEY || process.env.RESEND_KEY || process.env.RESEND_APIKEY || process.env.resend_api_key || "").trim();
    if (resendKey) {
        try {
            return await sendViaResend(to, subject, text, html, resendKey);
        } catch (resendErr) {
            console.error("Resend API failed, falling back:", resendErr.message);
        }
    }

    const brevoKey = (process.env.BREVO_API_KEY || process.env.BREVO_KEY || process.env.BREVO_APIKEY || process.env.brevo_api_key || "").trim();
    if (brevoKey) {
        try {
            return await sendViaBrevo(to, subject, text, html, brevoKey);
        } catch (brevoErr) {
            console.error("Brevo API failed, falling back:", brevoErr.message);
        }
    }

    // Fallback to Nodemailer SMTP
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
        console.log(`Email sent successfully via SMTP to ${to}. MessageId: ${info.messageId}`);
        return { provider: "SMTP", ...info };
    } catch (error) {
        console.error("Error sending email via SMTP:", error.message || error);
        transporter = null;
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = { sendEmail };