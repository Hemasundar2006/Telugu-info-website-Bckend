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
        'jamicharan811@gmail.com',
        'jamisabareesh74@gmail.com',
    ];

    console.log(`Sending SSC JE Recruitment 2025 notification to ${recipients.length} recipients...`);

    // Email content
    const subject = '🔔 SSC JE Recruitment 2025 – Notification Released!';
    
    const text = `Dear Telugu Info Member ${recipients.length},

The Staff Selection Commission (SSC) has officially released the Junior Engineer (JE) 2025 Recruitment Notification. This is a golden opportunity to join the prestigious Government sector as a Junior Engineer in various departments.

📋 SSC JE 2025 Overview:
- Exam Name: Junior Engineer (Civil, Mechanical, Electrical, Quantity Surveying & Contracts)
- Organization: Staff Selection Commission (SSC)
- Registration Dates: 30th June – 21st July 2025
- Exam Dates: 27th – 31st October 2025
- Salary: ₹35,400 – ₹1,12,400/-
- Job Location: Delhi NCR
- Official Website: https://ssc.gov.in/

📅 Important Dates:
- Notification Release: 30th June 2025
- Application Start: 30th June 2025
- Last Date to Apply: 21st July 2025
- Tier-1 Exam Dates: 27th to 31st October 2025

💸 Application Fee:
- General/OBC: ₹100/-
- SC/ST/Female/Ex-Servicemen: Exempted
- Payment Mode: Online (Net Banking, UPI, Debit/Credit Card)

🎓 Eligibility Criteria:
Educational Qualification: Diploma/Degree in Civil, Electrical, or Mechanical Engineering depending on the department (with work experience in some cases).

Age Limit:
- Up to 30 years or 32 years (varies by department)
- Age Relaxation: SC/ST – 5 yrs, OBC – 3 yrs, PwD – 10 to 15 yrs, ESM – 3 yrs

📌 Note:
The exact number of vacancies will be notified soon. Last year, there were 1,765 vacancies across multiple departments including BRO, CPWD, MES, CWC, and others.

For detailed qualifications, age limits, and department-wise eligibility, please visit the official SSC website: https://ssc.gov.in/

Best regards,
Telugu Info Team
Visit our website: https://telugu-info.vercel.app`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="text-align: center; background: linear-gradient(135deg, #0056b3, #0077cc); color: white; padding: 24px; border-radius: 8px;">
            <h2 style="margin: 0;">🔔 SSC JE Recruitment 2025</h2>
            <p style="font-size: 16px;">Notification Released!</p>
        </div>

        <div style="padding: 20px; line-height: 1.6; color: #333;">
            <p>Dear <strong>Telugu Info Member</strong>,</p>

            <p>The <strong>Staff Selection Commission (SSC)</strong> has officially released the <strong>Junior Engineer (JE) 2025 Recruitment Notification</strong>. This is a golden opportunity to join the prestigious Government sector as a Junior Engineer in various departments.</p>

            <h3 style="color: #0056b3;">📋 SSC JE 2025 Overview:</h3>
            <ul style="list-style-type: none; padding-left: 0;">
                <li>📝 <strong>Exam Name:</strong> Junior Engineer (Civil, Mechanical, Electrical, Quantity Surveying & Contracts)</li>
                <li>🏢 <strong>Organization:</strong> Staff Selection Commission (SSC)</li>
                <li>📅 <strong>Registration:</strong> 30th June – 21st July 2025</li>
                <li>📊 <strong>Exam Dates:</strong> 27th – 31st October 2025</li>
                <li>💰 <strong>Salary:</strong> ₹35,400 – ₹1,12,400/-</li>
                <li>📍 <strong>Job Location:</strong> Delhi NCR</li>
            </ul>

            <h3 style="color: #0056b3;">📅 Important Dates:</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                <tr style="background: #f5f5f5;">
                    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Event</th>
                    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Date</th>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Notification Release</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">30th June 2025</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Application Start</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">30th June 2025</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Last Date to Apply</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">21st July 2025</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Tier-1 Exam</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">27th to 31st October 2025</td>
                </tr>
            </table>

            <h3 style="color: #0056b3;">💸 Application Fee:</h3>
            <ul>
                <li><strong>General/OBC:</strong> ₹100/-</li>
                <li><strong>SC/ST/Female/Ex-Servicemen:</strong> Exempted</li>
                <li><strong>Payment Mode:</strong> Online (Net Banking, UPI, Debit/Credit Card)</li>
            </ul>

            <h3 style="color: #0056b3;">🎓 Eligibility Criteria:</h3>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 10px 0;">
                <p style="margin: 0;"><strong>Educational Qualification:</strong></p>
                <p style="margin: 5px 0;">Diploma/Degree in Civil, Electrical, or Mechanical Engineering depending on the department (with work experience in some cases).</p>
                
                <p style="margin: 10px 0 5px;"><strong>Age Limit:</strong></p>
                <ul>
                    <li>Up to 30 years or 32 years (varies by department)</li>
                    <li><strong>Age Relaxation:</strong>
                        <ul>
                            <li>SC/ST: 5 years</li>
                            <li>OBC: 3 years</li>
                            <li>PwD: 10 to 15 years</li>
                            <li>ESM: 3 years</li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #0056b3;">📌 Important Note:</h4>
                <p style="margin-bottom: 0;">The exact number of vacancies will be notified soon. Last year, there were <strong>1,765 vacancies</strong> across multiple departments including BRO, CPWD, MES, CWC, and others.</p>
            </div>

            <p style="margin-top: 20px; text-align: center;">
                👉 <a href="https://ssc.gov.in/" style="background: #0056b3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Apply Now</a>
            </p>
        </div>

        <div style="text-align: center; font-size: 14px; color: #666; border-top: 1px solid #ddd; padding-top: 20px;">
            <p>Best regards,<br>
            <strong>Telugu Info Team</strong></p>
            <p><a href="https://telugu-info.vercel.app" style="color: #0056b3; text-decoration: none;">Visit our website</a></p>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
                © 2024 Telugu Info. All rights reserved.<br>
                📧 marotinani06@gmail.com | 🌐 https://telugu-info.vercel.app/
            </p>
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

// Run the script
testEmail().catch(error => {
    console.error('Fatal error in test suite:', error);
    process.exit(1);
}); 