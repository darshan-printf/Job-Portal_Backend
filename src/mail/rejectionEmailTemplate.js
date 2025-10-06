// emailTemplates/rejectionEmail.js

export const rejectionEmailTemplate = (candidateName) => {
  const subject = "Application Status - Rejected";

  const text = `Dear ${candidateName},

We have reviewed your profile but unfortunately, you have not been shortlisted at this time.

We wish you the best for your future.

Regards,
HR Team`;

  const html = `
    <p>Dear <b>${candidateName}</b>,</p>
    <p>We have reviewed your profile but unfortunately, you have not been shortlisted at this time.</p>
    <p>We wish you the best for your future.</p>
    <p>Regards,<br>HR Team</p>
  `;

  return { subject, text, html };
};


