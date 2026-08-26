const getOtpEmailTemplate = (name, otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NexusCart OTP Verification</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; }
            .container { max-width: 550px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
            .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
            .content { padding: 35px 30px; text-align: center; color: #334155; }
            .greeting { font-size: 18px; font-weight: 600; margin-bottom: 15px; text-align: left; }
            .message { font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 25px; text-align: left; }
            .otp-box { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
            .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #2563eb; letter-spacing: 8px; margin: 5px 0; }
            .otp-note { font-size: 12px; color: #94a3b8; margin-top: 8px; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>NexusCart</h1>
                <p>Account Email Verification</p>
            </div>
            <div class="content">
                <div class="greeting">Hello ${name || 'Valued Customer'},</div>
                <div class="message">
                    Thank you for signing up with <strong>NexusCart</strong>. Please use the One-Time Password (OTP) below to verify your email address and complete your registration.
                </div>
                <div class="otp-box">
                    <div class="otp-code">${otp}</div>
                    <div class="otp-note">This OTP is valid for 10 minutes. Do not share this code with anyone.</div>
                </div>
                <div class="message" style="margin-top: 20px; font-size: 13px;">
                    If you did not request this verification code, please ignore this email.
                </div>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} NexusCart. All rights reserved.<br>
                This is an automated security message. Please do not reply.
            </div>
        </div>
    </body>
    </html>
    `;
};

const getOrderConfirmationTemplate = (order, user) => {
    const itemsHtml = (order.items || []).map(item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155;">
                ${item.name || (item.product && item.product.name) || 'Product Item'}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155; text-align: center;">
                ${item.qty || item.quantity || 1}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155; text-align: right; font-weight: 600;">
                $${((item.price || (item.product && item.product.price) || 0) * (item.qty || item.quantity || 1)).toFixed(2)}
            </td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - NexusCart</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 26px; font-weight: 800; }
            .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
            .content { padding: 35px 30px; color: #334155; }
            .greeting { font-size: 18px; font-weight: 600; margin-bottom: 10px; }
            .message { font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 20px; }
            .order-meta { background: #f8fafc; border-radius: 12px; padding: 15px 20px; margin-bottom: 25px; display: flex; justify-content: space-between; }
            .meta-item { font-size: 13px; color: #475569; }
            .meta-item strong { color: #0f172a; }
            .table-container { margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #f1f5f9; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; }
            .total-row { background: #f8fafc; font-weight: 700; font-size: 16px; color: #0f172a; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>NexusCart</h1>
                <p>Order Placed Successfully!</p>
            </div>
            <div class="content">
                <div class="greeting">Thank you for your order, ${user.name || 'Customer'}!</div>
                <div class="message">
                    We've received your order and are preparing it for shipment. Below are your order details:
                </div>
                <div class="order-meta">
                    <div class="meta-item">Order ID: <strong>#${order._id}</strong></div>
                    <div class="meta-item">Date: <strong>${new Date().toLocaleDateString()}</strong></div>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th style="text-align: center;">Qty</th>
                                <th style="text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                            <tr class="total-row">
                                <td colspan="2" style="padding: 14px; text-align: right;">Total Amount:</td>
                                <td style="padding: 14px; text-align: right; color: #10b981;">$${Number(order.totalPrice || order.totalAmount || 0).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="message" style="margin-top: 25px;">
                    We will send you another update as soon as your items are dispatched.
                </div>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} NexusCart Team. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = {
    getOtpEmailTemplate,
    getOrderConfirmationTemplate
};
