const interviewRejectedEmailTemplate = (
  candidateName,
  interviewDate,
  remark
) => {
  const subject = "Interview Rejected";

  const text = `Hello ${candidateName},
  Your interview on ${interviewDate} has been rejected.${remark ? `\nReason: ${remark}` : ""}`;

  const html = `
    <h3>Hello ${candidateName},</h3>
    <p>Your interview on <b>${interviewDate}</b> has been rejected.${remark ? `<br>Reason: ${remark}` : ""}</p>
  `;

  return { subject, text, html };
};
export { interviewRejectedEmailTemplate };