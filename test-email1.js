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

    console.log(`Sending welcome emails to ${recipients.length} recipients...`);

    // Email content
    const subject = 'Welcome to Telugu Info Community!';
    const text = 'Dear Member,\n\n' +
        'Welcome to the Telugu Info Community! We are delighted to have you with us.\n\n' +
        'As a member, you will receive regular updates, job opportunities, and important notifications directly to your email.\n\n' +
        'Stay connected and make the most of the resources and support we offer.\n\n' +
        'If you have any questions or suggestions, feel free to reach out.\n\n' +
        'For any related queries, you can contact us on WhatsApp: https://wa.me/917036180813\n\n' +
        'Best wishes,\nTelugu Info Team';

    const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
      <h2 style="color: #1976d2; text-align: center;">Welcome to Telugu Info Community!</h2>
      <p style="font-size: 16px; color: #222; text-align: center;">Dear Member,</p>
      <p style="font-size: 16px; color: #222; text-align: center;">We are delighted to have you with us.</p>
      <p style="font-size: 15px; color: #333;">As a member of the <b>Telugu Info Community</b>, you will receive regular updates, job opportunities, and important notifications directly to your email.</p>
      <p style="font-size: 15px; color: #333;">Stay connected and make the most of the resources and support we offer. We are here to help you grow and succeed!</p>
      <p style="font-size: 15px; color: #333;">If you have any questions or suggestions, feel free to reply to this email. We value your feedback and are always happy to assist.</p>
      <p style="font-size: 15px; color: #388e3c; text-align: center; margin: 24px 0;">For any related queries, you can contact us on WhatsApp: <a href="https://wa.me/917036180813" style="color: #1976d2; text-decoration: underline;">Click here to chat</a></p>
      <p style="font-size: 16px; color: #1976d2; text-align: center; margin-top: 32px;">Best wishes,<br>Telugu Info Team</p>
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