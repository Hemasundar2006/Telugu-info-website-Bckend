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
        'pillatirohith@gmail.com',
        ];

    console.log(`Sending SSC CHSL 2025 notification emails to recipients...`);

    // Email content
    const subject = '🏢 SSC CHSL Recruitment 2025 – 3131 Vacancies | Apply Before 18th July!';
    
    const text = `Dear Telugu Info Community Member,

We are excited to share a major job opportunity from the Staff Selection Commission (SSC)! 🚨

The SSC has officially released the Combined Higher Secondary Level (CHSL) Examination 2025 notification. This year, 3131 vacancies have been announced for various positions.

🎯 Available Positions:
- Lower Divisional Clerk (LDC)
- Junior Secretariat Assistant (JSA)
- Data Entry Operator (DEO)
- Data Entry Operator Grade 'A'

💰 Salary Structure:
- LDC/JSA: ₹19,900-63,200 (Pay Level 2)
- DEO: ₹25,500-81,100 (Level 4) to ₹29,200-92,300 (Level 5)
- DEO Grade 'A': ₹25,500-81,100 (Pay Level 4)

📅 Important Dates:
- Online Registration Start: 23rd June 2025
- Last Date to Apply: 18th July 2025 (11:00 PM)
- Fee Payment Deadline: 19th July 2025 (11:00 PM)
- Application Correction Window: 23rd & 24th July 2025
- Tier-1 Exam Date: 8th to 18th September 2025
- Tier-2 Exam Date: February-March 2026

📝 Selection Process:
1. Tier-1: Computer Based Test (Online)
   - General Intelligence (25 questions, 50 marks)
   - General Awareness (25 questions, 50 marks)
   - Quantitative Aptitude (25 questions, 50 marks)
   - English Language (25 questions, 50 marks)
   - Duration: 60 minutes (80 minutes for PwD candidates)

2. Tier-2: Computer Based Test + Skill Test & Typing Test

🎓 Eligibility:
- Age Limit: 18-27 years (as on 01/01/2026)
  * OBC: up to 30 years
  * SC/ST: up to 32 years
- Education: 12th Pass
  * For DEO positions in specific ministries: 12th Pass in Science stream with Mathematics

💳 Application Fee:
- General Category: ₹100
- SC/ST/PwD/Ex-servicemen/Female: Fee Exempted

🔗 Important Links:
- Official Website: https://ssc.gov.in/
- Notification PDF: [Official SSC CHSL 2025 Notification]
- Online Application: [Apply through SSC Portal]

Don't miss this opportunity to build a career in the Government sector. Apply before the deadline!

Best regards,
Telugu Info Team`;

    const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <div style="text-align: center; background: linear-gradient(135deg, #1565c0, #1e88e5); color: white; padding: 24px; border-radius: 8px;">
        <h2 style="margin: 0;">🏢 SSC CHSL Recruitment 2025</h2>
        <p style="font-size: 16px;">3131 Vacancies | Apply Before 18th July</p>
    </div>

    <div style="padding: 20px; line-height: 1.6; color: #333;">
        <p>Dear <strong>Telugu Info Community Member</strong>,</p>
        <p>We are excited to share a major job opportunity from the Staff Selection Commission (SSC)! 🚨</p>

        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="color: #1565c0; margin-top: 0;">🎯 Available Positions:</h4>
            <ul style="list-style-type: none; padding-left: 0;">
                <li>✓ Lower Divisional Clerk (LDC)</li>
                <li>✓ Junior Secretariat Assistant (JSA)</li>
                <li>✓ Data Entry Operator (DEO)</li>
                <li>✓ Data Entry Operator Grade 'A'</li>
            </ul>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="color: #1565c0; margin-top: 0;">💰 Salary Structure:</h4>
            <ul style="list-style-type: none; padding-left: 0;">
                <li>📌 LDC/JSA: ₹19,900-63,200 (Pay Level 2)</li>
                <li>📌 DEO: ₹25,500-81,100 (Level 4) to ₹29,200-92,300 (Level 5)</li>
                <li>📌 DEO Grade 'A': ₹25,500-81,100 (Pay Level 4)</li>
            </ul>
        </div>

        <h4 style="color: #1565c0;">📅 Important Dates:</h4>
        <ul>
            <li><strong>Online Registration Start:</strong> 23rd June 2025</li>
            <li><strong>Last Date to Apply:</strong> 18th July 2025 (11:00 PM)</li>
            <li><strong>Fee Payment Deadline:</strong> 19th July 2025 (11:00 PM)</li>
            <li><strong>Application Correction Window:</strong> 23rd & 24th July 2025</li>
            <li><strong>Tier-1 Exam Date:</strong> 8th to 18th September 2025</li>
            <li><strong>Tier-2 Exam Date:</strong> February-March 2026</li>
        </ul>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="color: #1565c0; margin-top: 0;">📝 Selection Process:</h4>
            <p><strong>1. Tier-1: Computer Based Test (Online)</strong></p>
            <ul style="margin-bottom: 10px;">
                <li>General Intelligence (25 questions, 50 marks)</li>
                <li>General Awareness (25 questions, 50 marks)</li>
                <li>Quantitative Aptitude (25 questions, 50 marks)</li>
                <li>English Language (25 questions, 50 marks)</li>
                <li>Duration: 60 minutes (80 minutes for PwD candidates)</li>
            </ul>
            <p><strong>2. Tier-2: Computer Based Test + Skill Test & Typing Test</strong></p>
        </div>

        <h4 style="color: #1565c0;">🎓 Eligibility:</h4>
        <ul>
            <li><strong>Age Limit:</strong> 18-27 years (as on 01/01/2026)
                <ul>
                    <li>OBC: up to 30 years</li>
                    <li>SC/ST: up to 32 years</li>
                </ul>
            </li>
            <li><strong>Education:</strong> 12th Pass
                <ul>
                    <li>For DEO positions in specific ministries: 12th Pass in Science stream with Mathematics</li>
                </ul>
            </li>
        </ul>

        <h4 style="color: #1565c0;">💳 Application Fee:</h4>
        <ul>
            <li>General Category: ₹100</li>
            <li>SC/ST/PwD/Ex-servicemen/Female: Fee Exempted</li>
        </ul>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1565c0; margin-top: 0;">🔗 Important Links:</h4>
            <p style="margin: 5px 0;"><strong>Official Website:</strong> <a href="https://ssc.gov.in/" style="color: #1976d2;">https://ssc.gov.in/</a></p>
            <p style="margin: 5px 0;"><strong>Notification PDF:</strong> <a href="#" style="color: #1976d2;">Official SSC CHSL 2025 Notification</a></p>
            <p style="margin: 5px 0;"><strong>Online Application:</strong> <a href="#" style="color: #1976d2;">Apply through SSC Portal</a></p>
        </div>

        <p style="margin-top: 20px;">Don't miss this opportunity to build a career in the Government sector. Apply before the deadline!</p>
    </div>

    <div style="text-align: center; font-size: 14px; color: #666; border-top: 1px solid #ddd; padding-top: 20px;">
        Best regards,<br>
        <strong>Telugu Info Team</strong><br>
        📧 [marotinani06@gmail.com] | 🌐 [https://telugu-info.vercel.app/] | 📞 [917036180813]
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