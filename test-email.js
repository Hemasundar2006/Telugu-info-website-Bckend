const { sendEmail } = require('./src/config/emailConfig');

async function testEmail() {
    console.log('Starting email test...');
    
    // List of email recipients
    const recipients = [
        
    ];

    console.log(`Sending RRB Technician Recruitment 2025 notification emails to recipients...`);

    // Email content
    const subject = '🚆 RRB Technician Recruitment 2025 – 6180 Vacancies | Apply Before 28th July!';
    

    const text = `Dear Telugu Info Community Member ,

We are excited to share a major job opportunity from the Indian Railways! 🚨

The Railway Recruitment Board (RRB) has officially released the RRB Technician Notification 2025 through the Employment Newspaper. This year, 6180 vacancies have been announced:

👷‍♂️ Technician Grade 1 Signal – 180 posts  
🛠️ Technician Grade 3 – 6000 posts  

Important Dates:
- Apply Online: 28th June 2025  
- Last Date to Apply: 28th July 2025 (11:59 PM)  
- Fee Payment Deadline: 28th July 2025

Eligibility:
- Grade 1 Signal: B.Sc. or Diploma/Degree in Engineering  
- Grade 3: Matric/SSLC + ITI or Act Apprenticeship

Application Fee:
- SC/ST/Female/EWS/PwD: ₹250 (refundable after CBT)  
- General/OBC: ₹500 (₹400 refundable after CBT)

Selection Process:
1. Computer-Based Test (CBT)
2. Document Verification
3. Medical Examination

Salary:
- Grade 1 Signal – ₹29,200/month  
- Grade 3 – ₹19,900/month

Apply Now: https://www.rrbcdg.gov.in

Don’t miss this opportunity to work with Indian Railways.

Best regards,  
Telugu Info Team`;


const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
  <div style="text-align: center; background: linear-gradient(135deg, #1565c0, #1e88e5); color: white; padding: 24px; border-radius: 8px;">
    <h2 style="margin: 0;">🚆 RRB Technician Recruitment 2025</h2>
    <p style="font-size: 16px;">6180 Vacancies | Apply Before 28th July</p>
  </div>

    <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://www.careerpower.in/blog/wp-content/uploads/2025/06/16143004/rrb-technician.webp" alt="RRB Technician Recruitment Banner" style="max-width: 100%; border-radius: 8px;">
  </div>
  

  <div style="padding: 20px; line-height: 1.6; color: #333;">
    <p>Dear <strong>Telugu Info Community Member</strong>,</p>
    <p>We are excited to share a major job opportunity from the Indian Railways! 🚨</p>

    <h4>📌 Vacancies:</h4>
    <ul>
      <li>👷‍♂️ <strong>Technician Grade 1 Signal</strong> – 180 posts</li>
      <li>🛠️ <strong>Technician Grade 3</strong> – 6000 posts</li>
    </ul>

    <h4>🗓️ Important Dates:</h4>
    <ul>
      <li><strong>Apply Online:</strong> 28th June 2025</li>
      <li><strong>Last Date to Apply:</strong> 28th July 2025 (11:59 PM)</li>
      <li><strong>Fee Payment Deadline:</strong> 28th July 2025</li>
    </ul>

    <h4>🎓 Eligibility:</h4>
    <ul>
      <li><strong>Grade 1 Signal:</strong> B.Sc. or Diploma/Degree in Engineering</li>
      <li><strong>Grade 3:</strong> Matric/SSLC + ITI or Act Apprenticeship</li>
    </ul>

    <h4>💰 Application Fee:</h4>
    <ul>
      <li><strong>SC/ST/Female/EWS/PwD:</strong> ₹250 (refundable after CBT)</li>
      <li><strong>General/OBC:</strong> ₹500 (₹400 refundable after CBT)</li>
    </ul>

    <h4>🧾 Selection Process:</h4>
    <ol>
      <li>Computer-Based Test (CBT)</li>
      <li>Document Verification</li>
      <li>Medical Examination</li>
    </ol>

    <h4>💼 Salary:</h4>
    <ul>
      <li><strong>Grade 1 Signal:</strong> ₹29,200/month</li>
      <li><strong>Grade 3:</strong> ₹19,900/month</li>
    </ul>

    <p style="margin-top: 20px; text-align: center;">
      👉 <a href="https://www.rrbcdg.gov.in" style="background: #388e3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Apply Now</a>
    </p>

    <p style="margin-top: 30px;">Don’t miss this opportunity to build a career with Indian Railways. Prepare well and apply before the deadline!</p>
  </div>

  <div style="text-align: center; font-size: 14px; color: #666; border-top: 1px solid #ddd; padding-top: 20px;">
    Warm regards,<br>
    <strong>Telugu Info Team</strong><br>
    📧 marotinani06@gmail.com | 🌐 https://telugu-info.vercel.app/ | 📞 917036180813
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