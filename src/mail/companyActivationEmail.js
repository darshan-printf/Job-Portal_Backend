import moment from "moment";
const Env = process.env;
const currentDate = moment().format("dddd, MMM DD, YYYY");
const currentTime = moment().format("hh:mm A");

export const companyActivationEmailTemplate = ( companyName,username,plainPassword) => {

    const subject = `Your Company ${companyName} Account Activated`;
    const text = `Hello ${companyName} ,Your account is now active.`;
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>5</title>
    <style>@import url(https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap);body{margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;min-height:100vh;padding:20px}.container{margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgb(0 0 0 / .3)}.header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:50px 40px;text-align:center;position:relative;overflow:hidden}.header::before{content:'';position:absolute;top:-50%;right:-50%;width:200%;height:200%;background:radial-gradient(circle,rgb(255 255 255 / .1) 0%,transparent 70%);animation:pulse 3s ease-in-out infinite}@keyframes pulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.1);opacity:.8}}.logo{width:80px;height:80px;border-radius:20px;background-color:#fff;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:40px;backdrop-filter:blur(10px);border:2px solid rgb(255 255 255 / .3)}.header h1{margin:0;color:#fff;font-size:32px;font-weight:700;position:relative}.header p{margin:12px 0 0 0;color:rgb(255 255 255 / .95);font-size:16px;position:relative;z-index:1}.content{padding:50px 40px}.greeting{font-size:18px;color:#1a1a1a;margin:0 0 15px 0;font-weight:600}.intro-text{color:#666;font-size:15px;line-height:1.7;margin:0 0 35px 0}.credentials-card{background:linear-gradient(135deg,#f6f9fc 0%,#e9f2f9 100%);border-radius:16px;padding:35px;margin-bottom:35px;border:2px solid #e1ecf7;position:relative;overflow:hidden}.credentials-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#667eea 0%,#764ba2 100%)}.credential-item{margin-bottom:25px}.credential-item:last-child{margin-bottom:0}.credential-label{color:#667eea;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;display:flex;align-items:center}.credential-label::before{content:'';width:6px;height:6px;background:#667eea;border-radius:50%;margin-right:8px}.credential-value{background:#fff;padding:16px 20px;border-radius:10px;font-size:18px;font-weight:600;color:#1a1a1a;font-family:'Courier New',monospace;border:2px solid #e1ecf7;box-shadow:0 2px 8px rgb(0 0 0 / .05);word-break:break-all}.security-notice{background:linear-gradient(135deg,#fff9e6 0%,#ffedd5 100%);border-left:5px solid #f59e0b;padding:20px 25px;border-radius:12px;margin:35px 0;box-shadow:0 4px 12px rgb(245 158 11 / .1)}.security-notice-title{display:flex;align-items:center;color:#92400e;font-weight:700;font-size:15px;margin-bottom:8px}.security-icon{font-size:20px;margin-right:10px}.security-notice p{margin:0;color:#78350f;font-size:14px;line-height:1.6}.info-cards{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin:35px 0}.info-card{background:#f8fafc;padding:20px;border-radius:12px;text-align:center;border:2px solid #e2e8f0}.info-card-icon{font-size:28px;margin-bottom:10px}.info-card-title{font-size:13px;color:#667eea;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}.info-card-text{font-size:14px;color:#64748b;line-height:1.5}.divider{height:2px;background:linear-gradient(90deg,transparent 0%,#e2e8f0 50%,transparent 100%);margin:35px 0}.closing{color:#64748b;font-size:15px;line-height:1.7;margin-bottom:25px}.signature{color:#1a1a1a;font-weight:600}.footer{background:linear-gradient(135deg,#1e293b 0%,#334155 100%);padding:40px;text-align:center}.footer-text{color:rgb(255 255 255 / .7);font-size:13px;line-height:1.6;margin:0 0 15px 0}.social-icons{margin-top:25px}.social-icons a{display:inline-block;width:40px;height:40px;background:rgb(255 255 255 / .1);border-radius:50%;margin:0 8px;line-height:40px;text-decoration:none;font-size:18px;transition:background 0.3s ease}.social-icons a:hover{background:rgb(255 255 255 / .2)}@media only screen and (max-width:600px){.container{border-radius:0}.content{padding:30px 25px}.header{padding:40px 25px}.info-cards{grid-template-columns:2fr}.footer{padding:30px 25px}}</style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo"><img src="https://cdn-icons-png.freepik.com/512/5968/5968374.png?uid=R165505067&ga=GA1.1.701570569.1719990316" alt="logo" style="width: 60px; height: 60px; "></div>
            <h1>Welcome to ${Env.PROJECT_NAME} </h1>
            <p>Your journey starts here. Please log in using your temporary password.</p>
        </div>
        <!-- Content -->
        <div class="content">
            <p class="greeting">Hello, <strong>${companyName}</strong>! 👋</p>
            <p class="intro-text">
                We're thrilled to have you join our platform! Your account has been successfully created and is ready to use. Below you'll find your login credentials to access all the amazing features we have in store for you.
            </p>
            <!-- Credentials Card -->
            <div class="credentials-card">
                <div class="credential-item">
                    <div class="credential-label">Username / Email</div>
                    <div class="credential-value">${username}</div>
                </div>
                <div class="credential-item">
                    <div class="credential-label">Temporary Password</div>
                    <div class="credential-value">${plainPassword}</div>
                </div>
            </div>
            <!-- Security Notice -->
            <div class="security-notice">
                <div class="security-notice-title">
                    <span class="security-icon">🔒</span>
                    Security First!
                </div>
                <p>For your protection, please change your password immediately after logging in for the first time. Choose a strong, unique password to keep your account secure.</p>
            </div>
            <!-- Info Cards -->
            <div class="info-cards">
                <div class="info-card">
                    <div class="info-card-icon">💬</div>
                    <div class="info-card-title">24/7 Support</div>
                    <div class="info-card-text">Our team is always here to help you</div>
                </div>
                <div class="info-card">
                    <div class="info-card-icon">📱</div>
                    <div class="info-card-title">Multi-Device</div>
                    <div class="info-card-text">Access from anywhere, anytime</div>
                </div>
            </div>
            <div class="divider"></div>
            <p class="closing">
                If you have any questions or need assistance getting started, our support team is just a click away. We're excited to see what you'll accomplish!
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
                This email was sent to you because an account was created on our platform.
                Please do not reply to this automated message.
            </p>
            <div class="social-icons">
                <a><img src="https://cdn-icons-png.freepik.com/512/2626/2626270.png?uid=R165505067&ga=GA1.1.701570569.1719990316" alt="ind" style="width: 40px; height: 40px;"></a>
                <a><img src="https://cdn-icons-png.freepik.com/512/15707/15707753.png?uid=R165505067&ga=GA1.1.701570569.1719990316" alt="Twitter" style="width: 40px; height: 40px;"></a>
                <a><img src="https://cdn-icons-png.freepik.com/512/733/733609.png?uid=R165505067&ga=GA1.1.701570569.1719990316" alt="LinkedIn" style="width: 40px; height: 40px;"></a>
                <a><img src="https://cdn-icons-png.freepik.com/512/13077/13077796.png?uid=R165505067&ga=GA1.1.701570569.1719990316" alt="Instagram" style="width: 40px; height: 40px;"></a>
            </div>
            <p class="footer-text" style="margin-top: 25px;">
                © Copyright ${Env.PROJECT_LONCHE_YEAR} <strong>${Env.PROJECT_NAME}</strong>.${Env.PROJECT_VERSION} All rights reserved. Read our Privacy Policy
            </p>
        </div>
    </div>
</body>
</html>
  `;

    return { subject, text, html };
};
