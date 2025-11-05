import moment from "moment";
const Env = process.env;
const currentDate = moment().format("dddd, MMM DD, YYYY");
const currentTime = moment().format("hh:mm A");

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

Interview Date: ${
    interviewDate ? new Date(interviewDate).toDateString() : "N/A"
  }
Remark: ${remark || "None"}

We are excited to have you join our team!

Best Regards,
${companyName} HR Team
`;

  const html = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      
      padding: 20px;
    }

    .container {
    
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 50px 40px;
      text-align: center;
      color: #fff;
    }

    .header h1 {
      margin: 0;
      font-size: 30px;
      font-weight: 700;
    }

    .header p {
      margin: 10px 0 0;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.9);
    }

    .logo {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      margin: 0 auto 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .content {
      padding: 45px 40px;
    }

    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 15px;
    }

    .message {
      color: #555;
      font-size: 15px;
      line-height: 1.7;
      margin-bottom: 35px;
    }

    .notice-card {
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
      border-left: 5px solid #6366f1;
      padding: 25px 30px;
      border-radius: 15px;
      margin-bottom: 35px;
      box-shadow: 0 6px 15px rgba(99, 102, 241, 0.1);
    }

    .notice-card h3 {
      margin: 0 0 10px 0;
      font-size: 18px;
      color: #4338ca;
    }

    .notice-card p {
      margin: 0;
      color: #312e81;
      font-size: 14px;
      line-height: 1.6;
    }

    .offer-details {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border: 2px solid #e2e8f0;
      border-radius: 15px;
      padding: 25px 30px;
      margin-bottom: 35px;
    }

    .offer-details h4 {
      margin: 0 0 15px 0;
      color: #1e293b;
      font-size: 17px;
      font-weight: 700;
    }

    .offer-details table {
      width: 100%;
      border-collapse: collapse;
    }

    .offer-details td {
      padding: 8px 0;
      color: #475569;
      font-size: 14px;
    }

    .offer-details td:first-child {
      font-weight: 600;
      width: 40%;
    }

    .cta {
      text-align: center;
      margin-bottom: 40px;
    }

    .cta a {
      display: inline-block;
      padding: 14px 35px;
      font-weight: 600;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      border-radius: 10px;
      text-decoration: none;
      transition: 0.3s ease;
    }

    .cta a:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }

    .closing {
      font-size: 15px;
      color: #64748b;
      line-height: 1.7;
      margin-bottom: 25px;
    }

    .signature {
      color: #1a1a1a;
      font-weight: 600;
    }

    .footer {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      padding: 35px;
      text-align: center;
    }

    .footer-text {
      color: rgba(255, 255, 255, 0.7);
      font-size: 13px;
      line-height: 1.6;
      margin: 0;
    }
     .social-icons {
            margin-top: 25px;
        }
        
        .social-icons a {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            margin: 0 8px;
            line-height: 40px;
            text-decoration: none;
            font-size: 18px;
            transition: background 0.3s ease;
        }
        
        .social-icons a:hover {
            background: rgba(255, 255, 255, 0.2);
        }

    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 25px;
      }
      .footer {
        padding: 25px;
      }
    }
  </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
       
        <h1>Congratulations!</h1>
        <p>You’ve Been Selected for the Position</p>
      </div>

      <!-- Content -->
      <div class="content">
        <p class="greeting">Dear <strong>${candidateName}</strong>,</p>

        <p class="message">
          We are delighted to inform you that you have been
          <strong>selected</strong> for the position of
          <strong>${jobTitle}</strong> at <strong>${companyName}</strong>. After
          a thorough review and interview process, our team was highly impressed
          by your performance and qualifications.
        </p>

        <div class="notice-card">
          <h3>✨ Congratulations on Your Selection!</h3>
          <p>
            You have been chosen to join our team. Your skills, enthusiasm, and
            dedication make you a perfect fit for this role. We’re excited to
            welcome you aboard and begin this journey together.
          </p>
        </div>

        <div class="offer-details">
          <h4>📋 Offer Letter Summary</h4>
          <table>
            <tr>
              <td>Job Title:</td>
              <td>${jobTitle}</td>
            </tr>
            <tr>
              <td>Salary:</td>
              <td>${salary}</td>
            </tr>
            <tr>
              <td>Joining Date:</td>
              <td>${interviewDate}</td>
            </tr>
            <tr>
              <td>Work Location:</td>
              <td>${jobField}</td>
            </tr>
          </table>
        </div>

        <div class="cta">
          <a href="[OfferLetterLink]" target="_blank"
            >📄 View & Download Offer Letter</a
          >
        </div>

        <p class="closing">
          Kindly review the attached offer letter and confirm your acceptance by
          replying to this email or using the link above. Once confirmed, our HR
          team will connect with you for further onboarding details.
        </p>

        <p class="signature">
              Best regards,<br>
                The <strong>${Env.PROJECT_NAME}</strong> Team<br>
                ${currentDate} <br>
                ${currentTime}
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p class="footer-text">
          This is an automated message – please do not reply directly. For any inquiries, please reach out to our HR department.
        </p>
        <div class="social-icons">
          <a"
            ><img
              src="https://cdn-icons-png.freepik.com/512/2626/2626270.png?uid=R165505067&ga=GA1.1.701570569.1719990316"
              alt="Facebook"
              style="width: 40px; height: 40px"
          /></a>
          <a "
            ><img
              src="https://cdn-icons-png.freepik.com/512/15707/15707753.png?uid=R165505067&ga=GA1.1.701570569.1719990316"
              alt="Twitter"
              style="width: 40px; height: 40px"
          /></a>
          <a "
            ><img
              src="https://cdn-icons-png.freepik.com/512/733/733609.png?uid=R165505067&ga=GA1.1.701570569.1719990316"
              alt="LinkedIn"
              style="width: 40px; height: 40px"
          /></a>
          <a "
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
