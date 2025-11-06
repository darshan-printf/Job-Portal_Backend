import moment from "moment";
const Env = process.env;
const currentDate = moment().format("dddd, MMM DD, YYYY");
const currentTime = moment().format("hh:mm A");

export const rejectionEmailTemplate = (candidateName, candidate) => {
  const subject = "Application Status - Rejected";

  const text = `Dear ${candidateName},

We have reviewed your profile but unfortunately, you have not been shortlisted at this time.

We wish you the best for your future.

Regards,
HR Team`;

  const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>6</title>
   <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      
      padding:  20px;
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
      background: linear-gradient(135deg, #fff5f5 0%, #ffe2e2 100%);
      border-left: 5px solid #ef4444;
      padding: 25px 30px;
      border-radius: 15px;
      margin-bottom: 35px;
      box-shadow: 0 6px 15px rgba(239, 68, 68, 0.1);
    }

    .notice-card h3 {
      margin: 0 0 10px 0;
      font-size: 18px;
      color: #b91c1c;
    }

    .notice-card p {
      margin: 0;
      color: #7f1d1d;
      font-size: 14px;
      line-height: 1.6;
    }

    .appreciation {
      background: linear-gradient(135deg, #f6f9fc 0%, #e9f2f9 100%);
      border: 2px solid #e1ecf7;
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 35px;
      text-align: center;
    }

    .appreciation h3 {
      margin: 0 0 10px 0;
      color: #334155;
      font-size: 18px;
      font-weight: 700;
    }

    .appreciation p {
      margin: 0;
      color: #475569;
      font-size: 14px;
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
              color: #fff;
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
     
      <h1>Application Update</h1>
      <p>Profile Review Result</p>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">Hello, <strong>${candidateName}</strong> 👋</p>

      <p class="message">
        Thank you for showing interest in the <strong>${candidate.jobId.title}</strong> position at <strong>${candidate.companyId.name}</strong> and for submitting your details to us.
      </p>

      <div class="notice-card">
        <h3>⚠️ Application Disqualified</h3>
        <p>
          After carefully reviewing your submitted information, we found that your profile does not fully match the requirements of the position you applied for.
          Therefore, we will not be moving forward with your application at this time.
        </p>
      </div>

      <div class="appreciation">
        <h3>🙏 We Appreciate Your Effort</h3>
        <p>
          Please don’t be discouraged — our hiring needs change frequently, and we encourage you to apply again in the future if a role aligns better with your experience and qualifications.
        </p>
      </div>

      <p class="closing">
        We truly appreciate the time and effort you put into your application. Wishing you success in your career journey ahead.
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
        This is an automated message – please do not reply directly to this email. For any inquiries, contact our support team.
      </p>
      <div class="social-icons">
                <a "><img src="https://cdn-icons-png.freepik.com/512/2626/2626270.png?uid=R165505067&ga=GA1.1.701570569.1719990316" alt="Facebook" style="width: 40px; height: 40px;"></a>
                <a "><img src="https://cdn-icons-png.freepik.com/512/15707/15707753.png?uid=R165505067&ga=GA1.1.701570569.1719990316" alt="Twitter" style="width: 40px; height: 40px;"></a>
                <a "><img src="https://cdn-icons-png.freepik.com/512/733/733609.png?uid=R165505067&ga=GA1.1.701570569.1719990316" alt="LinkedIn" style="width: 40px; height: 40px;"></a>
                <a "><img src="https://cdn-icons-png.freepik.com/512/13077/13077796.png?uid=R165505067&ga=GA1.1.701570569.1719990316" alt="Instagram" style="width: 40px; height: 40px;"></a>
               
            </div>
      <p class="footer-text" style="margin-top: 20px;">
        © Copyright ${Env.PROJECT_LONCHE_YEAR} <strong>${Env.PROJECT_NAME}</strong>.${Env.PROJECT_VERSION} All rights reserved. Read our Privacy Policy
      </p>
    </div>
  </div>
</body>
</html>

  `;

  return { subject, text, html };
};
