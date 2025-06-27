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

    console.log(`Sending SSC MTS 2025 notification emails to recipients...`);

    // Email content
    const subject = '🏢 SSC MTS & Havaldar Recruitment 2025 – 1075+ Vacancies | Apply Before 24th July!';
    
    const text = `Dear Telugu Info Community Member,

We are excited to share a major job opportunity from the Staff Selection Commission (SSC)! 🚨

The SSC has officially released the Multi-Tasking (Non-Technical) Staff and Havaldar (CBIC & CBN) Examination 2025-26 notification. Currently, 1075 Havaldar vacancies have been announced, with MTS vacancies to be announced soon.

🎯 Available Positions:
- Multi-Tasking Staff (MTS)
- Havaldar
- Peon
- Daftary
- Jamadar
- Junior Gestetner Operator
- Chowkidar
- Safaiwala
- Mali

📅 Important Dates:
- Online Registration Start: 26th June 2025
- Last Date to Apply: 24th July 2025 (11:00 PM)
- Fee Payment Deadline: 25th July 2025 (11:00 PM)
- Application Correction Window: 29th to 31st July 2025
- Exam Date (Paper I): 20th September to 24th October 2025

📝 Selection Process:
1. Paper 1 (Online) for both MTS and Havaldar posts
2. PET/PST (Physical Efficiency Test/Physical Standard Test) - Only for Havaldar post

💰 Salary:
- Pay Level-1 as per 7th Pay Commission
- Basic Pay: ₹5,200-20,200 + Grade Pay ₹1,800
- Total Monthly Salary: ₹18,000 to ₹22,000

🎓 Eligibility:
- Age Limit: 18-25 years (MTS), 18-27 years (Havaldar)
- Education: 10th Pass
- Citizenship: Indian

💳 Application Fee:
- SC/ST/PWD/Ex-servicemen/Female: Fee Exempted
- Other Categories: Check official notification

🔗 Important Links:
- Official Website: https://ssc.gov.in/
- Notification PDF: [Official SSC MTS 2025 Notification]
- Online Application: [Apply through SSC Portal]

Don't miss this opportunity to build a career in the Government sector. Apply before the deadline!

Best regards,
Telugu Info Team`;

    const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <div style="text-align: center; background: linear-gradient(135deg, #1565c0, #1e88e5); color: white; padding: 24px; border-radius: 8px;">
        <h2 style="margin: 0;">🏢 SSC MTS & Havaldar Recruitment 2025</h2>
        <p style="font-size: 16px;">1075+ Vacancies | Apply Before 24th July</p>
    </div>

    <div style="padding: 20px; line-height: 1.6; color: #333;">
        <p>Dear <strong>Telugu Info Community Member</strong>,</p>
        <p>We are excited to share a major job opportunity from the Staff Selection Commission (SSC)! 🚨</p>

        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="color: #1565c0; margin-top: 0;">🎯 Available Positions:</h4>
            <ul style="list-style-type: none; padding-left: 0;">
                <li>✓ Multi-Tasking Staff (MTS)</li>
                <li>✓ Havaldar</li>
                <li>✓ Peon</li>
                <li>✓ Daftary</li>
                <li>✓ Jamadar</li>
                <li>✓ Junior Gestetner Operator</li>
                <li>✓ Chowkidar</li>
                <li>✓ Safaiwala</li>
                <li>✓ Mali</li>
            </ul>
        </div>

        <h4 style="color: #1565c0;">📅 Important Dates:</h4>
        <ul>
            <li><strong>Online Registration Start:</strong> 26th June 2025</li>
            <li><strong>Last Date to Apply:</strong> 24th July 2025 (11:00 PM)</li>
            <li><strong>Fee Payment Deadline:</strong> 25th July 2025 (11:00 PM)</li>
            <li><strong>Application Correction Window:</strong> 29th to 31st July 2025</li>
            <li><strong>Exam Date (Paper I):</strong> 20th September to 24th October 2025</li>
        </ul>

        <h4 style="color: #1565c0;">📝 Selection Process:</h4>
        <ol>
            <li>Paper 1 (Online) for both MTS and Havaldar posts</li>
            <li>PET/PST (Physical Efficiency Test/Physical Standard Test) - Only for Havaldar post</li>
        </ol>

        <h4 style="color: #1565c0;">💰 Salary:</h4>
        <ul>
            <li>Pay Level-1 as per 7th Pay Commission</li>
            <li>Basic Pay: ₹5,200-20,200 + Grade Pay ₹1,800</li>
            <li>Total Monthly Salary: ₹18,000 to ₹22,000</li>
        </ul>

        <h4 style="color: #1565c0;">🎓 Eligibility:</h4>
        <ul>
            <li><strong>Age Limit:</strong> 18-25 years (MTS), 18-27 years (Havaldar)</li>
            <li><strong>Education:</strong> 10th Pass</li>
            <li><strong>Citizenship:</strong> Indian</li>
        </ul>

        <h4 style="color: #1565c0;">💳 Application Fee:</h4>
        <ul>
            <li>SC/ST/PWD/Ex-servicemen/Female: Fee Exempted</li>
            <li>Other Categories: Check official notification</li>
        </ul>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1565c0; margin-top: 0;">🔗 Important Links:</h4>
            <p style="margin: 5px 0;"><strong>Official Website:</strong> <a href="https://ssc.gov.in/" style="color: #1976d2;">https://ssc.gov.in/</a></p>
            <p style="margin: 5px 0;"><strong>Notification PDF:</strong> <a href="#" style="color: #1976d2;">Official SSC MTS 2025 Notification</a></p>
            <p style="margin: 5px 0;"><strong>Online Application:</strong> <a href="#" style="color: #1976d2;">Apply through SSC Portal</a></p>
        </div>

        <p style="margin-top: 20px;">Don't miss this opportunity to build a career in the Government sector. Apply before the deadline!</p>
    </div>

    <div style="text-align: center; font-size: 14px; color: #666; border-top: 1px solid #ddd; padding-top: 20px;">
        Best regards,<br>
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