const nodemailer = require("nodemailer");


const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kamalanathanthananchayan@gmail.com",
        pass: "edtn cfrb ogyj swmo"
      },
    }); 

    await transporter.sendMail({
      from: "kamalanathanthananchayan@gmail.com",
      to,
      subject,
      text,
    });

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;