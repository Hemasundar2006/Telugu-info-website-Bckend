const { sendEmail } = require('./src/config/emailConfig');

async function testEmail() {
    console.log('Starting email test...');
    
    // List of email recipients
    const recipients = [
        'marotinani06@gmail.com',
    ];

    console.log(`Sending feedback request emails to ${recipients.length} recipients...`);

    // Email content
    const subject = '🌟 We Value Your Feedback - Help Us Improve!';
    const text = 'Dear Telugu Info Member,\n\n' +
        'We hope you\'re finding our career tips and job opportunities helpful!\n\n' +
        'Your feedback is incredibly valuable to us. It helps us understand what works well and what we can improve.\n\n' +
        'Would you take a moment to share your thoughts?\n\n' +
        '1. How helpful are our weekly career tips?\n' +
        '2. Are the job opportunities relevant to your interests?\n' +
        '3. What topics would you like to see more of?\n\n' +
        'Click here to share your feedback: http://localhost:3000/feedback.html\n\n' +
        'Thank you for helping us serve you better!\n\n' +
        '— Telugu Info Team';

    const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <!-- Header Banner -->
      <div style="text-align: center; margin-bottom: 20px; background: linear-gradient(135deg, #4CAF50, #45a049); padding: 30px 20px; border-radius: 8px;">
        <img src="https://img.freepik.com/free-vector/feedback-concept-illustration_114360-1082.jpg" alt="Feedback" style="max-width: 80%; height: auto; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #ffffff; text-align: center; margin: 0; font-size: 24px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">🌟 We Value Your Feedback</h2>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="font-size: 16px; color: #222; margin-bottom: 20px;">Dear Telugu Info Member,</p>
        <p style="font-size: 15px; color: #333; margin-bottom: 20px;">We hope you're finding our career tips and job opportunities helpful!</p>
        <p style="font-size: 15px; color: #333; margin-bottom: 20px;">Your feedback is incredibly valuable to us. It helps us understand what works well and what we can improve.</p>
      </div>

      <!-- Feedback Questions Section -->
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px;">
        <h3 style="color: #4CAF50; margin-bottom: 20px; text-align: center;">Would you take a moment to share your thoughts?</h3>
        
        <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <p style="color: #333; margin: 0; font-weight: bold;">1. How helpful are our weekly career tips?</p>
          <div style="display: flex; justify-content: center; margin-top: 10px;">
            <span style="color: #666; margin: 0 5px;">⭐</span>
            <span style="color: #666; margin: 0 5px;">⭐</span>
            <span style="color: #666; margin: 0 5px;">⭐</span>
            <span style="color: #666; margin: 0 5px;">⭐</span>
            <span style="color: #666; margin: 0 5px;">⭐</span>
          </div>
        </div>
        <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <p style="color: #333; margin: 0; font-weight: bold;">2. Are the job opportunities relevant to your interests?</p>
        </div>
        <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <p style="color: #333; margin: 0; font-weight: bold;">3. What topics would you like to see more of?</p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <a href="http://localhost:3000/feedback.html" style="display: inline-block; background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 10px 0;">Share Your Feedback</a>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 16px; color: #1976d2; margin: 0;">— Telugu Info Team</p>
        <div style="margin: 15px 0;">
          <a href="https://linkedin.com/company/teluguinfo" style="text-decoration: none; margin: 0 10px;">
            <img src="https://img.icons8.com/color/48/000000/linkedin.png" style="width: 32px; height: 32px;">
          </a>
          <a href="https://twitter.com/teluguinfo" style="text-decoration: none; margin: 0 10px;">
            <img src="https://img.icons8.com/color/48/000000/twitter.png" style="width: 32px; height: 32px;">
          </a>
          <a href="https://facebook.com/teluguinfo" style="text-decoration: none; margin: 0 10px;">
            <img src="https://img.icons8.com/color/48/000000/facebook-new.png" style="width: 32px; height: 32px;">
          </a>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">© 2024 Telugu Info. All rights reserved.</p>
      </div>
    </div>`;

    // Send emails to all recipients
    let successCount = 0;
    let failureCount = 0;

    for (const email of recipients) {
        try {
            console.log(`Sending email to: ${email}`);
            const result = await sendEmail(email, subject, text, html);
            
            if (result.success) {
                console.log(`✅ Email sent successfully to: ${email}`);
                successCount++;
            } else {
                console.error(`❌ Failed to send email to ${email}:`, result.error);
                failureCount++;
            }
            
            // Add a small delay between emails to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`❌ Error sending email to ${email}:`, error);
            failureCount++;
        }
    }

    console.log('\nEmail sending summary:');
    console.log(`Total recipients: ${recipients.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failureCount}`);
}

// Run the tests
testEmail().catch(error => {
    console.error('Fatal error in test suite:', error);
    process.exit(1);
}); 