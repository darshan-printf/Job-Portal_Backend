import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // ya SMTP config use kar
      auth: {
        user: process.env.EMAIL_USER, // apna gmail id
        pass: process.env.EMAIL_PASS, // app password (gmail ke liye App Password use karna)
      },
    });

    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Email Error: ", error);
  }
};
