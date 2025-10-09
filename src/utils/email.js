import nodemailer from "nodemailer";
const Env = process.env

export const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // ya SMTP config use kar
      auth: {
        user: Env.EMAIL_USER, // apna gmail id
        pass: Env.EMAIL_PASS, // app password (gmail ke liye App Password use karna)
      },
    });

    await transporter.sendMail({
      from: `${Env.PROJECT_NAME} ${Env.PROJECT_LONCHE_YEAR} ${Env.DEVLOPER_ADDRESS}`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Email Error: ", error);
  }
};
