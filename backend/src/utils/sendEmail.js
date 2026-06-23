const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Smart Civic Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to} | MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    
    if (error.code === 'EAUTH') {
      console.error("Gmail Auth Error - Check App Password");
    }
    // Re-throw only if you want to fail the operation
    throw error;
  }
};

module.exports = sendEmail;