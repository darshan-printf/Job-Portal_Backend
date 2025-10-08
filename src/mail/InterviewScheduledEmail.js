export const interviewScheduledEmailTemplate = (
  candidateName,
  interviewDate,
  remark
) => {
  const subject = "Interview Scheduled";

  const text = `Hello ${candidateName},`;

  const html = `
    <h3>Hello ${candidateName},</h3>
    <p>Your interview is scheduled on <b>${interviewDate}</b> and remark is <b>${remark}</b>.</p>
  `;

  return { subject, text, html };
};

