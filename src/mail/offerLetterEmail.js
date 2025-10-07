export const offerLetterEmailTemplate = ({
  candidateName,
  jobTitle,
  jobField,
  salary,
  interviewDate,
  remark,
  companyName,
}) => {
  const subject = `Offer Letter for ${jobTitle} at ${companyName}`;

  const text = `Hello ${candidateName},

Congratulations! You have been selected for the position of ${jobTitle} in ${jobField} at ${companyName}.
Your expected salary package is ₹${salary || "Negotiable"}.

Interview Date: ${interviewDate ? new Date(interviewDate).toDateString() : "N/A"}
Remark: ${remark || "None"}

We are excited to have you join our team!

Best Regards,
${companyName} HR Team
`;

  const html = `
    <h2>Congratulations, ${candidateName}!</h2>
    <p>We are pleased to offer you the position of <b>${jobTitle}</b> in the <b>${jobField}</b> department at <b>${companyName}</b>.</p>
    <p><b>Salary:</b> ₹${salary || "Negotiable"}</p>
    ${interviewDate ? `<p><b>Interview Date:</b> ${new Date(interviewDate).toLocaleDateString()}</p>` : ""}
    ${remark ? `<p><b>Remark:</b> ${remark}</p>` : ""}
    <p>We look forward to welcoming you to our team!</p>
    <br/>
    <p>Best Regards,<br/>${companyName} HR Team</p>
  `;

  return { subject, text, html };
};
