import nodemailer from "nodemailer";

export const sendWarningEmail = async (userEmail, reviewText) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sahasrainduwara@gmail.com", 
        pass: "kyavqukpicgbxkap", 
      },
    });

    const mailOptions = {
      from: '"Support Team" <sahasrainduwara@gmail.com>',
      to: userEmail,
      subject: "Regarding Your Review Submission",
      text:`Dear user,\n\nWe noticed that your review contained certain phrases that indicate dissatisfaction:\n\n"${reviewText}"\n\nIf you need assistance, feel free to reach out.\n\nBest Regards,\nYour Support Team,`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};