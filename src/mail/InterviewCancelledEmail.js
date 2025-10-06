const interviewCancelledEmailTemplate = (name, interviewDate, remark) => {
  const subject = "Interview Cancelled";
  const text = `Hello ${name},\n\nYour interview on ${interviewDate} has been cancelled.${remark ? `\nReason: ${remark}` : ""}\n\nRegards,\nHMS Team`;
  const html = `
    <p>Hello ${name},</p>
    <p>Your interview on ${interviewDate} has been cancelled.${remark ? `<br>Reason: ${remark}` : ""}</p>
    <p>Regards,<br>HMS Team</p>
  `;
  return { subject, text, html };
};

export { interviewCancelledEmailTemplate };
