import moment from "moment";
const Env = process.env


export const companyActivationEmailTemplate = ( companyName, username, plainPassword) => {

  const subject = `Your Company ${companyName} Account Activated`;

  const text = `Hello ${companyName} ,Your account is now active.`;

  const html = `
    <h3>Hello ${companyName}, ${Env.PROJECT_NAME}</h3>
    <p>Your account has been <b>activated</b>.</p>
    <p><b>Username:</b> ${username}</p>
    <p><b>Password:</b> ${plainPassword}</p>
    <p>Please login and change your password immediately.</p>
  `;

  return { subject, text, html };
};

  