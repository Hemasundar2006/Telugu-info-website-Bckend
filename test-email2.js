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

    console.log(`Sending welcome emails to ${recipients.length} recipients...`);

    // Email content
    <div>
      <h1>SSC CGL 2025 Exam Details</h1>

      <h2>Overview</h2>
      <table border="1">
        <tbody>
          <tr><th>Exam Level</th><td>National level</td></tr>
          <tr><th>Exam Frequency</th><td>Once a year</td></tr>
          <tr><th>Category</th><td>Government Jobs</td></tr>
          <tr><th>Eligibility</th><td>Bachelor's degree from a recognised University or Institution</td></tr>
          <tr><th>Age-Limit</th><td>18 to 32 years (as on August 1, 2025)</td></tr>
          <tr><th>Exam Mode</th><td>Computer-Based Test (CBT) for Tier-I and Tier-II</td></tr>
          <tr><th>Exam Language</th><td>English and Hindi</td></tr>
          <tr><th>Application Fee</th><td>INR 100</td></tr>
          <tr><th>Total Registrations</th><td>20 Lakh approximately</td></tr>
          <tr><th>Vacancies</th><td>14,582</td></tr>
          <tr><th>Helpdesk No.</th><td>18003093063</td></tr>
          <tr>
            <th>Official Website</th>
            <td><a href="http://ssc.gov.in/" target="_blank" rel="noopener noreferrer">http://ssc.gov.in/</a></td>
          </tr>
        </tbody>
      </table>

      <h2>Important Dates</h2>
      <table border="1">
        <tbody>
          <tr><th>Notification Released</th><td>22-Apr-2025 to 09-Jun-2025</td></tr>
          <tr><th>Application Start Date</th><td>22-Apr-2025</td></tr>
          <tr><th>Application End Date</th><td>21-May-2025 to 04-Jul-2025</td></tr>
          <tr><th>Fee Submission (Online)</th><td>05-Jul-2025</td></tr>
          <tr><th>Fee Submission (Offline)</th><td>09-Jul-2025</td></tr>
          <tr><th>Application Correction Dates</th><td>11-Jul-2025</td></tr>
          <tr><th>Tier 1 Exam Dates</th><td>13-Aug-2025 to 30-Aug-2025</td></tr>
          <tr><th>Tier 2 Exam Dates</th><td>October/November 2025</td></tr>
        </tbody>
      </table>

      <h2>Exam Duration</h2>
      <table border="1">
        <tbody>
          <tr><th>Tier-I</th><td>60 minutes (online)</td></tr>
          <tr><th>Tier-II Paper 1</th><td>150 minutes</td></tr>
          <tr><th>Tier-II Paper 2</th><td>120 minutes</td></tr>
          <tr><th>Tier-II Paper 3</th><td>120 minutes</td></tr>
        </tbody>
      </table>

      <h2>Purpose</h2>
      <p>Selection of candidates for Group B and C posts in ministries, departments, and organisations of the Government of India.</p>

      <p><strong>Note:</strong> The above dates are tentative and will be updated after the official notification.</p>
    </div>
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