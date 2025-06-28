const { sendEmail } = require('./src/config/emailConfig');

async function testEmail() {
    console.log('Starting email test...');
    
    // List of email recipients
    const recipients = [
      'marotinani06@gmail.com',
        'nadimintihemalatha96@gmail.com',
        'hemasaiamujuri3@gmail.com',
        'marothihemasundar03@gmail.com',
        'gireeshpurli@gmail.com',
        'krishnaballanki69@gmail.com',
        'podugucharan95@gmail.com',
        'madabatthulasravanthrakesh@gmail.com',
        'krishnavenigadi11@gmail.com',
        'crvcrv114@gmail.com',
        'ganapathipanchireddy0@gmail.com',
        'kumarlikhith27@gmail.com',
        'bangarujoes@gmail.com',
        'teja2626swar@gmail.com',
        'pradeep@gmail.com',
        'chintadaprasad12@gmail.com',
        'sravyasrimusirana@gmail.com',
        'sravankoncha@gmail.com',
        'sathwik333chand@gmail.com',
        'bandarumadhuri32@gmail.com',
        'ponnanahema@gmail.com',
        'rameshstudy1234@gmail.com',
        'kundrapukumarswamy74@gmail.com',
        'naravadilleswararao1315@gmail.com',
        'podugucharan81@gmail.com',
        'rajitha9410@gmail.com',
        'sairutwik1123@gmail.com',
        'adinigowthami@gmail.com',
        'sutarisuchitra141@gmail.com',
        'mohansivaram2007@gmail.com',
        'narayanamurthykarnayana@gmail.com',
        'hemasundarmaroti@gmail.com',
        'hmmhmm@gmail.com',
        'sadfsafd@gmail.com',
        'shanmukharaoadapaka123@gmail.com',
        'akashvenkat4454@gmail.com',
        'tmgcewziubpoqwq@suiemail.com',
        'notforuse982@gmail.com',
        'hiteshganni007@gmail.com',
        'sam0cypher@gmail.com',
        'kiransomulakiran@gmail.com',
        'jayashreenaidu04@gmail.com',
        'manichindiri@gmail.com',
        'magesh12092004@gmail.com',
        'vajjathanuja@gmail.com',
        'himahasini.kallepalli@gmail.com',
        'gowthamkalahasti@gmail.com',
        'nadimintihemalatha7@gmail.com',
        'sudarsanpalavalasa@gmail.com',
        'mahalakshmikonna365@gmail.com',
        'saichandubondala9177@gmail.com',
        '21065chb@gmail.com',
        'saitrinadhh@gmail.com',
        'naveenallu.2008@gmail.com',
        'harikagummadi360@gmail.com',
        'lakshmivangapandu88@gmail.com',
        'smilykingtejasaikumar@gmail.com',
        'yamunathuta1@gmail.com',
        'jyothsnapatnana@gmail.com',
        'mahadevumatha@gmail.com',
        'pogirihari617@gmail.com',
        
        
    ];

    console.log(`Sending welcome emails to  recipients...`);

    // Email content
    const subject = '🌟 We Value Your Feedback - Help Us Improve!';
    const text = 'Dear Telugu Info Member,\n\n' +
        'We hope you\'re finding our career tips and job opportunities helpful!\n\n' +
        'Your feedback is incredibly valuable to us. It helps us understand what works well and what we can improve.\n\n' +
        'Would you take a moment to share your thoughts?\n\n' +
        '1. How helpful are our weekly career tips?\n' +
        '2. Are the job opportunities relevant to your interests?\n' +
        '3. What topics would you like to see more of?\n\n' +
        'Click here to share your feedback: https://teluguinfo.com/feedback\n\n' +
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
          </div>
        </div>
        <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <p style="color: #333; margin: 0; font-weight: bold;">2. Are the job opportunities relevant to your interests?</p>
        </div>
        <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <p style="color: #333; margin: 0; font-weight: bold;">3. What topics would you like to see more of?</p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://teluguinfo.com/feedback" style="display: inline-block; background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 10px 0;">Share Your Feedback</a>
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