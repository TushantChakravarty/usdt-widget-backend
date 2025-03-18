export const emailTemplates = {
  welcome: `
      <h2>Welcome, {{ name }}!</h2>
      <p>We are glad to have you at {{ company }}.</p>
      <p>Please verify your email by clicking <a href="{{ link }}">here</a>.</p>
      <p>Best Regards,<br>Team {{ company }}</p>
  `,
  resetPassword: `
      <h2>Hello, {{ name }}!</h2>
      <p>You requested a password reset.</p>
      <p>Click <a href="{{ resetLink }}">here</a> to reset your password.</p>
      <p>If you didn't request this, please ignore this email.</p>
  `,

  loginOtp: `
   <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            
            <h2 style="text-align: center; color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">USDT Marketplace</h2>
            
            <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.5;">Your One-Time Password (OTP) for Login in USDT Marketplace is:</p>
    
            <div style="text-align: center; padding: 20px; margin: 20px 0; background-color: #f1f1f1; border-radius: 8px;">
              <p style="font-size: 36px; font-weight: bold; color: #007bff; margin: 0;">{{otp}}</p>
            </div>
    
            <p style="font-size: 16px; line-height: 1.5;">Please enter this OTP to complete your login process. This OTP is valid for <strong>10 minutes</strong>.</p>
    
            <div style="background-color: #007bff; color: white; padding: 10px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p>If you did not request this OTP, please <a href="mailto:support@usdtmarketplace.com" style="color: white; text-decoration: underline;">contact our support team</a> immediately.</p>
            </div>
    
            <p style="font-size: 16px; line-height: 1.5;">Thank you,</p>
            <p style="font-size: 16px; line-height: 1.5;">The USDT Marketplace Team</p>
    
            <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
            <small style="color: #666; font-size: 12px;">If you have any questions, feel free to reach out to us at <a href="mailto:support@usdtmarketplace.com" style="color: #007bff; text-decoration: none;">support@usdtmarketplace.com</a></small>
          </div>
        </div>
  `,
  signUpOtp:`
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            
            <h2 style="text-align: center; color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">USDT Marketplace</h2>
            
            <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.5;">Your One-Time Password (OTP) for Sign up in USDT Marketplace is:</p>
    
            <div style="text-align: center; padding: 20px; margin: 20px 0; background-color: #f1f1f1; border-radius: 8px;">
              <p style="font-size: 36px; font-weight: bold; color: #007bff; margin: 0;">{{otp}}</p>
            </div>
    
            <p style="font-size: 16px; line-height: 1.5;">Please enter this OTP to complete your sign up process. This OTP is valid for <strong>10 minutes</strong>.</p>
    
            <div style="background-color: #007bff; color: white; padding: 10px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p>If you did not request this OTP, please <a href="mailto:support@usdtmarketplace.com" style="color: white; text-decoration: underline;">contact our support team</a> immediately.</p>
            </div>
    
            <p style="font-size: 16px; line-height: 1.5;">Thank you,</p>
            <p style="font-size: 16px; line-height: 1.5;">The USDT Marketplace Team</p>
    
            <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
            <small style="color: #666; font-size: 12px;">If you have any questions, feel free to reach out to us at <a href="mailto:support@usdtmarketplace.com" style="color: #007bff; text-decoration: none;">support@usdtmarketplace.com</a></small>
          </div>
        </div>
  `,
  forgetPasswordOtp:`<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            
            <h2 style="text-align: center; color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">USDT Marketplace</h2>
            
            <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.5;">Your One-Time Password (OTP) for accessing USDT Marketplace is:</p>
    
            <div style="text-align: center; padding: 20px; margin: 20px 0; background-color: #f1f1f1; border-radius: 8px;">
              <p style="font-size: 36px; font-weight: bold; color: #007bff; margin: 0;">{{otp}}</p>
            </div>
    
            <p style="font-size: 16px; line-height: 1.5;">Please enter this OTP to complete your verification process. This OTP is valid for <strong>10 minutes</strong>.</p>
    
            <div style="background-color: #007bff; color: white; padding: 10px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p>If you did not request this OTP, please <a href="mailto:support@usdtmarketplace.com" style="color: white; text-decoration: underline;">contact our support team</a> immediately.</p>
            </div>
    
            <p style="font-size: 16px; line-height: 1.5;">Thank you,</p>
            <p style="font-size: 16px; line-height: 1.5;">The USDT Marketplace Team</p>
    
            <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
            <small style="color: #666; font-size: 12px;">If you have any questions, feel free to reach out to us at <a href="mailto:support@usdtmarketplace.com" style="color: #007bff; text-decoration: none;">support@usdtmarketplace.com</a></small>
          </div>
        </div>`
};