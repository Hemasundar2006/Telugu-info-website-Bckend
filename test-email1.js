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
        'ananthasaiananthasai40@gmail.com',
        'chirikikishorkumar@gmail.com',
        'gowthamiec020@gmail.com',
        'rohithvarri98@gmail.com',
        'umashankarnaidu71@gmail.com',
        'kick@123gmail.com',
        'ricky27333@gmail.com',
        'shaikkarimulla2438@gmail.com',
        'vyaswanth183@gmail.com',
        'Ponnadathanuja691@gmail.com',
        'jahnavi@2008gmail.com',
        'mysterioustruths23@gmail.com',
        'ethicalhacker3568@gmail.com',
        'thatigouthami95@gmail.com',
        'sumiyonukonduri@gmail.com',
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
        'pogirihari617@gmail.com'
    ];

    console.log(`Sending welcome emails to ${recipients.length} recipients...`);

    // Email content
    const subject = 'Welcome to Telugu Info Community!';
    const text = 'Dear Member,\n\n' +
        'Welcome to the Telugu Info Community! We are delighted to have you with us.\n\n' +
        'As a member, you will receive regular updates, job opportunities, and important notifications directly to your email.\n\n' +
        'Stay connected and make the most of the resources and support we offer. We are here to help you grow and succeed!\n\n' +
        '📱 Join our WhatsApp Channel for instant updates:\n' +
        'https://whatsapp.com/channel/0029Vb7K4xO1noz27fvVPG28\n\n' +
        '🌐 Visit our website: https://telugu-info.vercel.app/\n\n' +
        '💬 Have any queries or suggestions? Please go through our feedback page and share your valuable feedback with us.\n\n' +
        'If you have any questions or suggestions, feel free to reach out.\n\n' +
        'For any related queries, you can also contact us on WhatsApp: https://wa.me/917036180813\n\n' +
        'Best wishes,\nTelugu Info Team';

    const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
      <h2 style="color: #1976d2; text-align: center;">Welcome to Telugu Info Community!</h2>
      <p style="font-size: 16px; color: #222; text-align: center;">Dear Member,</p>
      <p style="font-size: 16px; color: #222; text-align: center;">We are delighted to have you with us.</p>
      <p style="font-size: 15px; color: #333;">As a member of the <b>Telugu Info Community</b>, you will receive regular updates, job opportunities, and important notifications directly to your email.</p>
      <p style="font-size: 15px; color: #333;">Stay connected and make the most of the resources and support we offer. We are here to help you grow and succeed!</p>
      
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3 style="color: #1976d2; margin: 0 0 15px 0;">📱 Join Our WhatsApp Channel</h3>
        <p style="font-size: 14px; color: #333; margin: 0 0 15px 0;">Get instant updates on job opportunities and community news!</p>
        <a href="https://whatsapp.com/channel/0029Vb7K4xO1noz27fvVPG28" style="background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Join WhatsApp Channel</a>
      </div>
      
      <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3 style="color: #7b1fa2; margin: 0 0 15px 0;">🌐 Visit Our Website</h3>
        <p style="font-size: 14px; color: #333; margin: 0 0 15px 0;">Explore more resources and opportunities on our platform!</p>
        <a href="https://telugu-info.vercel.app/" style="background: #7b1fa2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Visit Website</a>
      </div>
      
      <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3 style="color: #f57c00; margin: 0 0 15px 0;">💬 Share Your Feedback</h3>
        <p style="font-size: 14px; color: #333; margin: 0 0 15px 0;">Have any queries or suggestions? Please go through our feedback page and share your valuable feedback with us!</p>
        <a href="https://telugu-info.vercel.app/feedback" style="background: #f57c00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Give Feedback</a>
      </div>
      
      <p style="font-size: 15px; color: #333;">If you have any questions or suggestions, feel free to reply to this email. We value your feedback and are always happy to assist.</p>
      <p style="font-size: 15px; color: #388e3c; text-align: center; margin: 24px 0;">For any related queries, you can also contact us on WhatsApp: <a href="https://wa.me/917036180813" style="color: #1976d2; text-decoration: underline;">Click here to chat</a></p>
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