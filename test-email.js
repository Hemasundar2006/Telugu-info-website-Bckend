const { sendEmail } = require('./src/config/emailConfig');

async function testEmail() {
    console.log('Starting email test...');
    
    // Test case 1: Basic email
    console.log('\nTest Case 1: Basic email');
    try {
        const result = await sendEmail(
            'marotinani06@gmail.com',
            'Thank You for subscribing to Telugu Info Website',
            'Thank you for subscribing to Telugu Info Website. We are excited to have you on board!',
            '<h1>Thank You for subscribing to Telugu Info Website</h1><p>Thank you for subscribing to Telugu Info Website. We are excited to have you on board!</p>'
        );

        if (result.success) {
            console.log('✅ Email sent successfully!');
            console.log('Message ID:', result.messageId);
            console.log('Response:', result.info);
        } else {
            console.error('❌ Failed to send email:', result.error);
            if (result.code) {
                console.error('Error code:', result.code);
            }
        }
    } catch (error) {
        console.error('❌ Error in test:', error);
    }

    // Test case 2: HTML only email
    console.log('\nTest Case 2: HTML only email');
    try {
        const result = await sendEmail(
            'marothihemasundar03@gmail.com',
            'Thank You for subscribing to Telugu Info Website',
            'Thank you for subscribing to Telugu Info Website. We are excited to have you on board!',
            '<h1>Thank You for subscribing to Telugu Info Website</h1><p>Thank you for subscribing to Telugu Info Website. We are excited to have you on board!</p>'
        );

        if (result.success) {
            console.log('✅ HTML email sent successfully!');
            console.log('Message ID:', result.messageId);
        } else {
            console.error('❌ Failed to send HTML email:', result.error);
        }
    } catch (error) {
        console.error('❌ Error in HTML test:', error);
    }
}

// Run the tests
testEmail().catch(error => {
    console.error('Fatal error in test suite:', error);
    process.exit(1);
}); 