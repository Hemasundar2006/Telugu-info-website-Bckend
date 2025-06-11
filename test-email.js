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
        'kiransomulakiran@gmail.com'
    ];

    console.log(`Sending SSC CGL notification emails to ${recipients.length} recipients...`);

    // Email content
    const subject = 'SSC CGL 2025 Notification Released - Apply Now!';
    const text = 'SSC CGL 2025 Exam Details\n\nOverview:\n- Exam Level: National level\n- Exam Frequency: Once a year\n- Category: Government Jobs\n- Eligibility: Bachelor\'s degree from a recognised University\n- Age-Limit: 18 to 32 years (as on August 1, 2025)\n- Exam Mode: Computer-Based Test (CBT)\n- Exam Language: English and Hindi\n- Application Fee: INR 100\n- Total Vacancies: 14,582\n\nImportant Dates:\n- Notification Released: 22-Apr-2025 to 09-Jun-2025\n- Application Start Date: 22-Apr-2025\n- Application End Date: 21-May-2025 to 04-Jul-2025\n- Tier 1 Exam Dates: 13-Aug-2025 to 30-Aug-2025\n- Tier 2 Exam Dates: October/November 2025\n\nFor more details and to apply, visit: http://ssc.gov.in/\n\nStay updated with our WhatsApp Channel:\nhttps://whatsapp.com/channel/0029Va9UwjB6HXUNjS0Sf43L\n\nBest regards,\nThe Telugu Info Team';
    
    const html = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">' +
        '<h1 style="color: #2c3e50; text-align: center;">SSC CGL 2025</h1>' +
        '<h2 style="color: #34495e; text-align: center;">Staff Selection Commission Combined Graduate Level</h2>' +
        
        '<div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">' +
        '<h3 style="color: #2c3e50; margin-top: 0;">📋 Overview</h3>' +
        '<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">' +
        '<tr style="background-color: #e9ecef;"><th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Exam Level</th><td style="padding: 10px; border: 1px solid #dee2e6;">National level</td></tr>' +
        '<tr><th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Exam Frequency</th><td style="padding: 10px; border: 1px solid #dee2e6;">Once a year</td></tr>' +
        '<tr style="background-color: #e9ecef;"><th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Category</th><td style="padding: 10px; border: 1px solid #dee2e6;">Government Jobs</td></tr>' +
        '<tr><th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Eligibility</th><td style="padding: 10px; border: 1px solid #dee2e6;">Bachelor\'s degree from a recognised University</td></tr>' +
        '<tr style="background-color: #e9ecef;"><th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Age-Limit</th><td style="padding: 10px; border: 1px solid #dee2e6;">18 to 32 years (as on August 1, 2025)</td></tr>' +
        '<tr><th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Vacancies</th><td style="padding: 10px; border: 1px solid #dee2e6;">14,582</td></tr>' +
        '</table>' +
        '</div>' +
        
        '<div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">' +
        '<h3 style="color: #2c3e50; margin-top: 0;">📅 Important Dates</h3>' +
        '<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">' +
        '<tr style="background-color: #e9ecef;"><th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Notification Released</th><td style="padding: 10px; border: 1px solid #dee2e6;">22-Apr-2025 to 09-Jun-2025</td></tr>' +
        '<tr><th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Application Start Date</th><td style="padding: 10px; border: 1px solid #dee2e6;">22-Apr-2025</td></tr>' +
        '<tr style="background-color: #e9ecef;"><th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Application End Date</th><td style="padding: 10px; border: 1px solid #dee2e6;">21-May-2025 to 04-Jul-2025</td></tr>' +
        '<tr><th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Tier 1 Exam Dates</th><td style="padding: 10px; border: 1px solid #dee2e6;">13-Aug-2025 to 30-Aug-2025</td></tr>' +
        '<tr style="background-color: #e9ecef;"><th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Tier 2 Exam Dates</th><td style="padding: 10px; border: 1px solid #dee2e6;">October/November 2025</td></tr>' +
        '</table>' +
        '</div>' +
        
        '<div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">' +
        '<h3 style="color: #2c3e50; margin-top: 0;">⏱️ Exam Duration</h3>' +
        '<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">' +
        '<tr style="background-color: #e9ecef;"><th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Tier-I</th><td style="padding: 10px; border: 1px solid #dee2e6;">60 minutes (online)</td></tr>' +
        '<tr><th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Tier-II Paper 1</th><td style="padding: 10px; border: 1px solid #dee2e6;">150 minutes</td></tr>' +
        '<tr style="background-color: #e9ecef;"><th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Tier-II Paper 2</th><td style="padding: 10px; border: 1px solid #dee2e6;">120 minutes</td></tr>' +
        '<tr><th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Tier-II Paper 3</th><td style="padding: 10px; border: 1px solid #dee2e6;">120 minutes</td></tr>' +
        '</table>' +
        '</div>' +
        
        '<div style="text-align: center; margin: 30px 0;">' +
        '<a href="http://ssc.gov.in/" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Apply Now →</a>' +
        '</div>' +
        
        '<div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">' +
        '<h3 style="color: #2c3e50; margin-top: 0;">📱 Stay Updated</h3>' +
        '<p style="font-size: 16px; line-height: 1.6;">Join our WhatsApp Channel to receive instant updates about exam notifications and important dates:</p>' +
        '<p style="font-size: 16px; line-height: 1.6;"><a href="https://whatsapp.com/channel/0029Va9UwjB6HXUNjS0Sf43L" style="background-color: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Join WhatsApp Channel →</a></p>' +
        '</div>' +
        
        '<p style="font-size: 14px; color: #6c757d; font-style: italic;">Note: The above dates are tentative and will be updated after the official notification.</p>' +
        '<p style="font-size: 16px; line-height: 1.6;">Best regards,<br>The Telugu Info Team</p>' +
        '</div>';

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