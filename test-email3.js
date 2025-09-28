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
        'gptgamerz51@gmail.com',
        'jamisabareesh74@gmail.com',
        'lohithvasantha50@gmail.com',
        'deepikajagarana2007@gmail.com',
        'moditeja029@gmail.com',
        'gopal.antyakula19@gmail.com',
        'marotikesava@gmail.com',
        'teja4028@gmail.com',
        'abhichichulla@gmail.com',
        'dasarimaneesha91@gmail.com',
        'krishnaballanki472@gmail.com',
        'kummaritirupathi8@gmail.com',
        'mrroodboy1@gmail.com',
        'mysterioustruths23@gmail.com',
        'ananthasaiananthasai40@gmail.com',
        'chirikikishorkumar@gmail.com',
        'gowthamiec020@gmail.com',
        'rohithvarri98@gmail.com',
        'umashankarnaidu71@gmail.com',
        'kick@123gmail.com',
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
        'mahavumatha@gmail.com',
        'pogirihari617@gmail.com',
        'gireeshpurli@gmail.com',
    ];

    console.log(`Sending Bank of Baroda Recruitment 2025 emails to ${recipients.length} recipients...`);

    // Email content
    const subject = '🏦 Bank of Baroda Recruitment 2025 - 417 Sales Manager & Agriculture Officer Posts';
    const text = 'Dear Telugu Info Member,\n\n' +
        'We are excited to share a significant career opportunity with the Bank of Baroda.\n\n' +
        'Job Overview:\n' +
        '• Organization: Bank of Baroda\n' +
        '• Total Vacancies: 417 positions\n' +
        '• Positions: Manager-Sales, Agriculture Officer, and Agriculture Manager\n' +
        '• Advertisement No.: BOB/HRM/REC/ADVT/2025/11\n\n' +
        'Eligibility:\n' +
        'Manager - Sales:\n' +
        '• Education: Graduation in any discipline\n' +
        '• Age Limit: 24-34 years\n\n' +
        'Officer Agriculture Sales/Manager Agriculture Sales:\n' +
        '• Education: 4-year Degree in:\n' +
        '  - Agriculture/Horticulture\n' +
        '  - Animal Husbandry/Veterinary Science\n' +
        '  - Dairy Science/Fishery Science\n' +
        '  - Agriculture Marketing & Cooperation\n' +
        '  - Agricultural Biotechnology/Food Science\n' +
        '  - And related agricultural fields\n' +
        '• Age Limit:\n' +
        '  - Officer: 24-36 years\n' +
        '  - Manager: 26-42 years\n\n' +
        'Application Fee:\n' +
        '• General, EWS & OBC: ₹850 + Applicable Taxes\n' +
        '• SC, ST, PWD, ESM/DESM & Women: ₹175 + Applicable Taxes\n\n' +
        'Salary Structure:\n' +
        '• JMG/S-I: ₹48,480 - ₹85,920\n' +
        '• MMG/S-II: ₹64,820 - ₹93,960\n\n' +
        'Important Dates:\n' +
        '• Application Start: 6 August 2025\n' +
        '• Application Deadline: 26 August 2025\n\n' +
        'How to Apply:\n' +
        'Visit https://bankofbaroda.in and complete the online application process.\n\n' +
        'Don\'t miss this opportunity to join one of India\'s leading public sector banks!\n\n' +
        'Best regards,\n' +
        '— Telugu Info Team';

    const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <!-- Header Banner -->
      <div style="text-align: center; margin-bottom: 20px; background: linear-gradient(135deg, #004C8F, #003366); padding: 30px 20px; border-radius: 8px;">
        <img src="https://www.bankofbaroda.in/-/media/project/bob/countrywebsites/india/home/about-us/brand/logo_new.svg" alt="Bank of Baroda Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;">
        <h2 style="color: #ffffff; text-align: center; margin: 0; font-size: 24px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">🏦 Bank of Baroda Recruitment 2025</h2>
        <p style="color: #ffffff; margin-top: 10px;">417 Sales Manager & Agriculture Officer Posts</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="font-size: 16px; color: #222; margin-bottom: 20px;">Dear Telugu Info Member,</p>
        <p style="font-size: 15px; color: #333; margin-bottom: 20px;">We are excited to share a significant career opportunity with the Bank of Baroda.</p>
      </div>

      <!-- Job Overview Section -->
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px;">
        <h3 style="color: #004C8F; margin-bottom: 20px;">Job Overview</h3>
        <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <p style="color: #333; margin: 0 0 10px 0;"><strong>Organization:</strong> Bank of Baroda</p>
          <p style="color: #333; margin: 0 0 10px 0;"><strong>Total Vacancies:</strong> 417 positions</p>
          <p style="color: #333; margin: 0 0 10px 0;"><strong>Positions:</strong> Manager-Sales, Agriculture Officer, Agriculture Manager</p>
          <p style="color: #333; margin: 0;"><strong>Advertisement No.:</strong> BOB/HRM/REC/ADVT/2025/11</p>
        </div>

        <h3 style="color: #004C8F; margin: 20px 0;">Position Details</h3>
        <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <h4 style="color: #004C8F; margin: 0 0 15px 0;">Manager - Sales</h4>
          <ul style="color: #333; margin: 0 0 20px 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Education: Graduation in any discipline</li>
            <li>Age Limit: 24-34 years</li>
          </ul>

          <h4 style="color: #004C8F; margin: 15px 0;">Officer/Manager Agriculture Sales</h4>
          <ul style="color: #333; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Education: 4-year Degree in Agricultural Sciences</li>
            <li style="margin-bottom: 8px;">Specializations: Agriculture, Horticulture, Animal Husbandry, etc.</li>
            <li style="margin-bottom: 8px;">Age Limit (Officer): 24-36 years</li>
            <li>Age Limit (Manager): 26-42 years</li>
          </ul>
        </div>

        <h3 style="color: #004C8F; margin: 20px 0;">Application Fee</h3>
        <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <ul style="color: #333; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">General, EWS & OBC: ₹850 + Applicable Taxes</li>
            <li>SC, ST, PWD, ESM/DESM & Women: ₹175 + Applicable Taxes</li>
          </ul>
        </div>

        <h3 style="color: #004C8F; margin: 20px 0;">Salary Structure</h3>
        <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <ul style="color: #333; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">JMG/S-I: ₹48,480 - ₹85,920</li>
            <li>MMG/S-II: ₹64,820 - ₹93,960</li>
          </ul>
        </div>

        <h3 style="color: #004C8F; margin: 20px 0;">Important Dates</h3>
        <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <p style="color: #333; margin: 0 0 10px 0;"><strong>Application Start:</strong> 6 August 2025</p>
          <p style="color: #333; margin: 0;"><strong>Application Deadline:</strong> 26 August 2025</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://bankofbaroda.in" style="display: inline-block; background: #004C8F; color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 10px 0;">Apply Now</a>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 16px; color: #1976d2; margin: 0;">— Telugu Info Team</p>
        
        <p style="color: #666; font-size: 12px; margin-top: 20px;">© 2025 Telugu Info. All rights reserved.</p>
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