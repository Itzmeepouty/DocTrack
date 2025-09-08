module.exports = {
  verificationEmail: (email, verificationCode) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your DocuTrack Account</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f8fafc;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          
          .email-header {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
          }
          
          .email-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)" /></svg>');
            opacity: 0.3;
          }
          
          .logo-section {
            position: relative;
            z-index: 2;
            margin-bottom: 20px;
          }
          
          .logo-container {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            margin-bottom: 16px;
          }
          
          .logo-icon {
            width: 32px;
            height: 32px;
            fill: white;
          }
          
          .brand-title {
            color: white;
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .brand-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 400;
          }
          
          .email-body {
            padding: 40px 30px;
          }
          
          .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
          }
          
          .welcome-text {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 32px;
            line-height: 1.7;
          }
          
          .verification-section {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            margin-bottom: 32px;
            border: 1px solid #e2e8f0;
          }
          
          .verification-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
          }
          
          .verification-code {
            display: inline-block;
            font-size: 32px;
            font-weight: 700;
            color: #3b82f6;
            background: white;
            padding: 20px 32px;
            border-radius: 12px;
            border: 2px solid #e2e8f0;
            letter-spacing: 4px;
            margin-bottom: 24px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          }
          
          .divider {
            position: relative;
            text-align: center;
            margin: 32px 0;
          }
          
          .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #e2e8f0;
          }
          
          .divider-text {
            background: white;
            padding: 0 16px;
            color: #9ca3af;
            font-size: 14px;
            position: relative;
          }
          
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            min-width: 200px;
          }
          
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
          }
          
          .security-notice {
            background: #fef7ec;
            border: 1px solid #fed7aa;
            border-radius: 8px;
            padding: 16px;
            margin-top: 32px;
          }
          
          .security-notice-title {
            font-weight: 600;
            color: #ea580c;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
          }
          
          .security-icon {
            width: 16px;
            height: 16px;
            margin-right: 8px;
            fill: #ea580c;
          }
          
          .security-notice-text {
            font-size: 14px;
            color: #9a3412;
            line-height: 1.5;
          }
          
          .email-footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          
          .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 16px;
          }
          
          .footer-links {
            margin-bottom: 16px;
          }
          
          .footer-link {
            color: #3b82f6;
            text-decoration: none;
            font-size: 14px;
            margin: 0 12px;
          }
          
          .footer-link:hover {
            text-decoration: underline;
          }
          
          .copyright {
            font-size: 12px;
            color: #9ca3af;
          }
          
          .user-info {
            background: rgba(59, 130, 246, 0.1);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
          }
          
          .user-info-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          
          .user-info-value {
            font-size: 16px;
            color: #1f2937;
            font-weight: 500;
          }
          
          @media (max-width: 600px) {
            .email-container {
              margin: 0 16px;
              border-radius: 12px;
            }
            
            .email-header {
              padding: 32px 24px;
            }
            
            .email-body {
              padding: 32px 24px;
            }
            
            .verification-section {
              padding: 24px;
            }
            
            .verification-code {
              font-size: 24px;
              padding: 16px 24px;
              letter-spacing: 2px;
            }
            
            .brand-title {
              font-size: 28px;
            }
            
            .greeting {
              font-size: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header Section -->
          <div class="email-header">
            <div class="logo-section">
              <div class="logo-container">
                <svg class="logo-icon" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h1 class="brand-title">DocuTrack</h1>
              <p class="brand-subtitle">Document Management System</p>
            </div>
          </div>

          <!-- Body Section -->
          <div class="email-body">
            <h2 class="greeting">Welcome!</h2>
            <p class="welcome-text">
              Thank you for joining DocuTrack! We're excited to have you on board. To get started with managing your documents efficiently, please verify your email address using the verification code below.
            </p>

            <!-- User Information -->
            <div class="user-info">
              <div class="user-info-label">Account Details</div>
              <div class="user-info-value">Email: ${email}</div>
            </div>

            <!-- Verification Section -->
            <div class="verification-section">
              <h3 class="verification-title">Your Verification Code</h3>
              <div class="verification-code">${verificationCode}</div>
            </div>

            <!-- Security Notice -->
            <div class="security-notice">
              <div class="security-notice-title">
                <svg class="security-icon" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                Security Notice
              </div>
              <p class="security-notice-text">
                If you didn't create an account with DocuTrack, please ignore this email.
              </p>
            </div>
          </div>

          <!-- Footer Section -->
          <div class="email-footer">
            <p class="footer-text">
              Need help? Contact our support team or visit our help center.
            </p>
            <p class="copyright">
              &copy; 2025 DocuTrack Systems. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
};