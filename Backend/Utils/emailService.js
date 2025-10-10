// utils/emailService.js
const nodemailer = require("nodemailer");

// Create reusable transporter (configure with your SMTP settings)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // Your email
      pass: process.env.SMTP_PASS, // Your email password or app password
    },
  });
};

const sendEmail = async (coverData, pdfBuffer, token) => {
  try {
    const transporter = createTransporter();

    // Email content
    const mailOptions = {
      from: `"Assignment Cover Generator" <${process.env.SMTP_USER}>`,
      to: process.env.PRINT_SHOP_EMAIL, // Print shop owner's email
      subject: `Print Request - ${token}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          
          <!-- Token -->
          <div style="background-color: #f8f9fa; border-left: 4px solid #10b981; padding: 20px; margin-bottom: 30px;">
            <div style="font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Token</div>
            <div style="font-size: 24px; font-weight: 600; color: #111827; letter-spacing: 2px;">${token}</div>
          </div>

          <!-- Student Info -->
          <div style="margin-bottom: 25px;">
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Name</div>
            <div style="font-size: 16px; color: #111827;">${coverData.name}</div>
          </div>

          <div style="margin-bottom: 30px;">
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Student ID</div>
            <div style="font-size: 16px; color: #111827;">${coverData.studentId}</div>
          </div>

          <!-- PDF Notice -->
          <div style="padding: 15px; background-color: #f0fdf4; border-radius: 6px; text-align: center;">
            <div style="font-size: 14px; color: #047857;">PDF attached</div>
          </div>

        </div>
      `,
      attachments: [
        {
          filename: `${token}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { sendEmail };
