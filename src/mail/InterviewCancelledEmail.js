const interviewCancelledEmailTemplate = (name, interviewDate, remark) => {
  const subject = `Interview Cancelled on ${interviewDate}`;
  const text = `Hello ${name}`;
  const html = `
    <p>Hello ${name},</p>
    <p>Your interview on ${interviewDate} has been cancelled.${remark ? `<br>Reason: ${remark}` : ""}</p>
    <p>Regards,<br>HMS Team</p>
  `;
  return { subject, text, html };
};

export { interviewCancelledEmailTemplate };
