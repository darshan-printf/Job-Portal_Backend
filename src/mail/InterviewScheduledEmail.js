export const interviewScheduledEmailTemplate = (
  candidateName,
  interviewDate,
  remark
) => {
  const subject = "Interview Scheduled";

  const text = `Hello ${candidateName},
  Your interview is scheduled on ${interviewDate} and remark is ${remark}.`;

  const html = `
    <h3>Hello ${candidateName},</h3>
    <p>Your interview is scheduled on <b>${interviewDate}</b> and remark is <b>${remark}</b>.</p>
  `;

  return { subject, text, html };
};

