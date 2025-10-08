const interviewRejectedEmailTemplate = (
  candidateName,
  interviewDate,
  remark
) => {
  const subject = `Interview Rejected on ${interviewDate}`;
  const text = `Hello ${candidateName},`;
  const html = `
    <h3>Hello ${candidateName},</h3>
    <p>Your interview on <b>${interviewDate}</b> has been rejected.${remark ? `<br>Reason: ${remark}` : ""}</p>
  `;

  return { subject, text, html };
};
export { interviewRejectedEmailTemplate };