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
        
    ];

    console.log(`Sending SSC CGL notification emails to ${recipients.length} recipients...`);

    // Email content
    const subject = 'YOKOGAWA Recruitment Drive 2025 – Diploma Trainee Engineer | 3 LPA | Apply Now';
    const text = 'Dear Candidate,\n\n' +
        'We are excited to announce the YOKOGAWA Recruitment Drive 2025 for the position of Diploma Trainee Engineer. This opportunity is brought to you by the Department of Technical Education, Government of Andhra Pradesh.\n\n' +
        'Position: Diploma Trainee Engineer\n' +
        'Salary: 3 LPA\n' +
        'Job Location: Bangalore\n' +
        'Last Date for Registration: 19-06-2025\n\n' +
        'Eligibility:\n' +
        '- 2025 pass outs of Diploma in DECE, DEEE, or DAEIE\n' +
        '- Minimum 60% in academics from SSC onwards with no active backlogs\n\n' +
        'Benefits:\n' +
        '- Free Transportation\n' +
        '- Medical Insurance\n' +
        '- Subsidized Cafeteria Meals\n' +
        '- On-site opportunities in Japan\n' +
        '- Japanese Language Training\n\n' +
        'Selection Process:\n' +
        '- Online Assessment (Technical)\n' +
        '- Technical Interview & HR Interview\n' +
        '- Issue of Offer Letter\n\n' +
        'Service Agreement:\n' +
        'Bond period of 3 years (If you leave within 3 years, a recovery of ₹2,00,000 applies)\n\n' +
        'How to Apply:\n' +
        'Interested and eligible candidates can apply using the link below:\n' +
        'Apply Here: https://docs.google.com/forms/d/e/1FAIpQLSfHpwV6rm3aP8FljXr-SrveHyCskV4_BtMKIO8UYwXsLhDX1Q/viewform?usp=send_form\n\n' +
        'Note:\n' +
        'Only students who are committed to joining after selection should apply.\n\n' +
        'For more details, please refer to the official notification or contact your Training & Placement Cell.\n\n' +
        'Best wishes,\n' +
        'Training & Placement Cell\n' +
        'Department of Technical Education\n' +
        'Government of Andhra Pradesh';

    const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
      <h2 style="color: #003366; text-align: center; margin-bottom: 0;">YOKOGAWA Recruitment Drive 2025</h2>
      <h3 style="color: #ff9900; text-align: center; margin-top: 8px;">Diploma Trainee Engineer | 3 LPA</h3>
      <p style="font-size: 16px; color: #222;">
        <strong>Dear Candidate,</strong><br><br>
        We are excited to announce the <b>YOKOGAWA Recruitment Drive 2025</b> for the position of <b>Diploma Trainee Engineer</b>. This opportunity is brought to you by the Department of Technical Education, Government of Andhra Pradesh.
      </p>
      <ul style="font-size: 15px; color: #333; line-height: 1.7;">
        <li><b>Position:</b> Diploma Trainee Engineer</li>
        <li><b>Salary:</b> 3 LPA</li>
        <li><b>Job Location:</b> Bangalore</li>
        <li><b>Last Date for Registration:</b> 19-06-2025</li>
      </ul>
      <h4 style="color: #1976d2; margin-bottom: 4px;">Eligibility:</h4>
      <ul style="font-size: 15px; color: #333;">
        <li>2025 pass outs of Diploma in DECE, DEEE, or DAEIE</li>
        <li>Minimum 60% in academics from SSC onwards with no active backlogs</li>
      </ul>
      <h4 style="color: #1976d2; margin-bottom: 4px;">Benefits:</h4>
      <ul style="font-size: 15px; color: #333;">
        <li>Free Transportation</li>
        <li>Medical Insurance</li>
        <li>Subsidized Cafeteria Meals</li>
        <li>On-site opportunities in Japan</li>
        <li>Japanese Language Training</li>
      </ul>
      <h4 style="color: #1976d2; margin-bottom: 4px;">Selection Process:</h4>
      <ul style="font-size: 15px; color: #333;">
        <li>Online Assessment (Technical)</li>
        <li>Technical Interview & HR Interview</li>
        <li>Issue of Offer Letter</li>
      </ul>
      <h4 style="color: #1976d2; margin-bottom: 4px;">Service Agreement:</h4>
      <ul style="font-size: 15px; color: #333;">
        <li>Bond period of 3 years (If you leave within 3 years, a recovery of ₹2,00,000 applies)</li>
      </ul>
      <h4 style="color: #1976d2; margin-bottom: 4px;">How to Apply:</h4>
      <p style="font-size: 15px; color: #333;">Interested and eligible candidates can apply using the link below:</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSfHpwV6rm3aP8FljXr-SrveHyCskV4_BtMKIO8UYwXsLhDX1Q/viewform?usp=send_form" style="background-color: #388e3c; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 18px; font-weight: bold; display: inline-block;">Apply Here</a>
      </div>
      <p style="font-size: 15px; color: #d32f2f;"><b>Note:</b> Only students who are committed to joining after selection should apply.</p>
      <p style="font-size: 15px; color: #333;">For more details, please refer to the official notification or contact your Training & Placement Cell.</p>
      <p style="font-size: 16px; line-height: 1.6;">Best wishes,<br>Training & Placement Cell<br>Department of Technical Education<br>Government of Andhra Pradesh</p>
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