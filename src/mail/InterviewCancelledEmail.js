import moment from "moment";
const Env = process.env;
const currentDate = moment().format("dddd, MMM DD, YYYY");
const currentTime = moment().format("hh:mm A");

const interviewCancelledEmailTemplate = (name, interviewDate, remark) => {
  const subject = `Interview Cancelled on ${interviewDate
    .moment()
    .format("dddd, MMM DD, YYYY hh:mm A")}  `;
  const text = `Hello ${name}`;
  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>2</title>
   <style> @import url(https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap);body{margin:0;padding:0;font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;min-height:100vh;padding:20px}.container{margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgb(0 0 0 / .3)}.header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:50px 40px;text-align:center;color:#fff}.header h1{margin:0;font-size:30px;font-weight:700}.header p{margin:10px 0 0;font-size:16px;color:rgb(255 255 255 / .9)}.logo{width:80px;height:80px;background-color:#fff;border-radius:20px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:40px;backdrop-filter:blur(10px);border:2px solid rgb(255 255 255 / .3)}.content{padding:45px 40px}.greeting{font-size:18px;font-weight:600;color:#1a1a1a;margin-bottom:15px}.message{color:#555;font-size:15px;line-height:1.7;margin-bottom:35px}.notice-card{background:linear-gradient(135deg,#fff5f5 0%,#ffe2e2 100%);border-left:5px solid #ef4444;padding:25px 30px;border-radius:15px;margin-bottom:35px;box-shadow:0 6px 15px rgb(239 68 68 / .1)}.notice-card h3{margin:0 0 10px 0;font-size:18px;color:#b91c1c}.notice-card p{margin:0;color:#7f1d1d;font-size:14px;line-height:1.6}.reschedule{background:linear-gradient(135deg,#f6f9fc 0%,#e9f2f9 100%);border:2px solid #e1ecf7;border-radius:16px;padding:30px;margin-bottom:35px;text-align:center}.reschedule h3{margin:0 0 10px 0;color:#334155;font-size:18px;font-weight:700}.reschedule p{margin:0;color:#475569;font-size:14px}.closing{font-size:15px;color:#64748b;line-height:1.7;margin-bottom:25px}.signature{color:#1a1a1a;font-weight:600}.social-icons{margin-top:25px}.social-icons a{display:inline-block;width:40px;height:40px;background:rgb(255 255 255 / .1);border-radius:50%;margin:0 8px;line-height:40px;text-decoration:none;font-size:18px;transition:background 0.3s ease}.social-icons a:hover{background:rgb(255 255 255 / .2)}.footer{background:linear-gradient(135deg,#1e293b 0%,#334155 100%);padding:35px;text-align:center}.footer-text{color:rgb(255 255 255 / .7);font-size:13px;line-height:1.6;margin:0}@media only screen and (max-width:600px){.content{padding:30px 25px}.footer{padding:25px}}</style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="logo">
          <img
            src="https://cdn-icons-png.freepik.com/512/5968/5968374.png?uid=R165505067&ga=GA1.1.701570569.1719990316"
            alt="logo"
            style="width: 60px; height: 60px"
          />
        </div>
        <h1>Interview Update</h1>
        <p>Important notice regarding your scheduled interview</p>
      </div>
      <!-- Content -->
      <div class="content">
        <p class="greeting">Hello, <strong>${name}</strong> 👋</p>
        <p class="message">
          We hope you're doing well. We wanted to inform you that your upcoming interview 
           has been <strong>cancelled</strong> due
          to some unforeseen circumstances. We sincerely apologize for any
          inconvenience this may cause. ${remark} ${interviewDate
    .moment()
    .format("dddd, MMM DD, YYYY hh:mm A")}
        </p>
        <div class="notice-card">
          <h3>🚫 Interview Cancelled</h3>
          <p>
            Due to certain scheduling or operational reasons, we had to cancel
            your interview. Please be assured that this is only a temporary
            change, and our team is already working to provide you with a new
            interview slot soon.
          </p>
        </div>
        <div class="reschedule">
          <h3>📅 Rescheduling Soon</h3>
          <p>
            You will receive an updated interview schedule via email shortly.
            Thank you for your patience and understanding.
          </p>
        </div>
        <p class="closing">
          We truly appreciate your interest in joining Our recruitment team will reach out
          to you once your new schedule is confirmed.
        </p>
        <p class="signature">
           Best wishes,
                Best regards,<br>
                The <strong>${Env.PROJECT_NAME}</strong> Team<br>
                ${currentDate} <br>
                ${currentTime}
        </p>
      </div>
      <!-- Footer -->
      <div class="footer">
        <p class="footer-text">
          This is an automated message – please do not reply directly to this
          email. For any questions, contact our support team.
        </p>
        <div class="social-icons">
          <a 
            ><img
              src="https://cdn-icons-png.freepik.com/512/2626/2626270.png?uid=R165505067&ga=GA1.1.701570569.1719990316"
              alt="Facebook"
              style="width: 40px; height: 40px"
          /></a>
          <a 
            ><img
              src="https://cdn-icons-png.freepik.com/512/15707/15707753.png?uid=R165505067&ga=GA1.1.701570569.1719990316"
              alt="Twitter"
              style="width: 40px; height: 40px"
          /></a>
          <a 
            ><img
              src="https://cdn-icons-png.freepik.com/512/733/733609.png?uid=R165505067&ga=GA1.1.701570569.1719990316"
              alt="LinkedIn"
              style="width: 40px; height: 40px"
          /></a>
          <a 
            ><img
              src="https://cdn-icons-png.freepik.com/512/13077/13077796.png?uid=R165505067&ga=GA1.1.701570569.1719990316"
              alt="Instagram"
              style="width: 40px; height: 40px"
          /></a>
        </div>
        <p class="footer-text" style="margin-top: 20px">
           © Copyright ${Env.PROJECT_LONCHE_YEAR} <strong>${
    Env.PROJECT_NAME
  }</strong>.${Env.PROJECT_VERSION} All rights reserved. Read our Privacy Policy
        </p>
      </div>
    </div>
  </body>
</html>
    
  `;
  return { subject, text, html };
};

export { interviewCancelledEmailTemplate };
