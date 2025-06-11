const { sendEmail } = require('./src/config/emailConfig');

async function testEmail() {
    console.log('Starting email test...');
    
    // Test case 1: Basic email
    console.log('\nTest Case 1: Basic email');
    try {
        const result = await sendEmail(
            'marotinani06@gmail.com',
            'Welcome to Telugu Info - Your Subscription Confirmation',
            'Dear Subscriber,\n\nThank you for subscribing to Telugu Info Website. We are delighted to have you join our community of Telugu culture enthusiasts.\n\nWhat to expect from us:\n• Latest updates on Telugu news and events\n• Cultural insights and traditions\n• Language learning resources\n• Community highlights and stories\n\nJoin our WhatsApp Channel for instant updates:\nhttps://whatsapp.com/channel/0029Va9UwjB6HXUNjS0Sf43L\n\nStay connected with us on our social media platforms for more engaging content.\n\nBest regards,\nThe Telugu Info Team',
            '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">' +
            '<h1 style="color: #2c3e50; text-align: center;">Welcome to Telugu Info</h1>' +
            '<h2 style="color: #34495e; text-align: center;">Your Subscription Confirmation</h2>' +
            '<p style="font-size: 16px; line-height: 1.6;">Dear Subscriber,</p>' +
            '<p style="font-size: 16px; line-height: 1.6;">Thank you for subscribing to Telugu Info Website. We are delighted to have you join our community of Telugu culture enthusiasts.</p>' +
            '<h3 style="color: #2c3e50;">What to expect from us:</h3>' +
            '<ul style="font-size: 16px; line-height: 1.6;">' +
            '<li>Latest updates on Telugu news and events</li>' +
            '<li>Cultural insights and traditions</li>' +
            '<li>Language learning resources</li>' +
            '<li>Community highlights and stories</li>' +
            '</ul>' +
            '<div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">' +
            '<h3 style="color: #2c3e50; margin-top: 0;">Join Our WhatsApp Channel</h3>' +
            '<p style="font-size: 16px; line-height: 1.6;">Get instant updates and stay connected with our community:</p>' +
            '<p style="font-size: 16px; line-height: 1.6;"><a href="https://whatsapp.com/channel/0029Va9UwjB6HXUNjS0Sf43L" style="color: #007bff; text-decoration: none;">Join WhatsApp Channel →</a></p>' +
            '</div>' +
            '<p style="font-size: 16px; line-height: 1.6;">Stay connected with us on our social media platforms for more engaging content.</p>' +
            '<p style="font-size: 16px; line-height: 1.6;">Best regards,<br>The Telugu Info Team</p>' +
            '</div>'
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
            'Welcome to Telugu Info - Your Subscription Confirmation',
            'Dear Subscriber,\n\nThank you for subscribing to Telugu Info Website. We are delighted to have you join our community of Telugu culture enthusiasts.\n\nWhat to expect from us:\n• Latest updates on Telugu news and events\n• Cultural insights and traditions\n• Language learning resources\n• Community highlights and stories\n\nJoin our WhatsApp Channel for instant updates:\nhttps://whatsapp.com/channel/0029Va9UwjB6HXUNjS0Sf43L\n\nStay connected with us on our social media platforms for more engaging content.\n\nBest regards,\nThe Telugu Info Team',
            '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">' +
            '<h1 style="color: #2c3e50; text-align: center;">Welcome to Telugu Info</h1>' +
            '<h2 style="color: #34495e; text-align: center;">Your Subscription Confirmation</h2>' +
            '<p style="font-size: 16px; line-height: 1.6;">Dear Subscriber,</p>' +
            '<p style="font-size: 16px; line-height: 1.6;">Thank you for subscribing to Telugu Info Website. We are delighted to have you join our community of Telugu culture enthusiasts.</p>' +
            '<h3 style="color: #2c3e50;">What to expect from us:</h3>' +
            '<ul style="font-size: 16px; line-height: 1.6;">' +
            '<li>Latest updates on Telugu news and events</li>' +
            '<li>Cultural insights and traditions</li>' +
            '<li>Language learning resources</li>' +
            '<li>Community highlights and stories</li>' +
            '</ul>' +
            '<div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">' +
            '<h3 style="color: #2c3e50; margin-top: 0;">Join Our WhatsApp Channel</h3>' +
            '<p style="font-size: 16px; line-height: 1.6;">Get instant updates and stay connected with our community:</p>' +
            '<p style="font-size: 16px; line-height: 1.6;"><a href="https://whatsapp.com/channel/0029Va9UwjB6HXUNjS0Sf43L" style="color: #007bff; text-decoration: none;">Join WhatsApp Channel →</a></p>' +
            '</div>' +
            '<p style="font-size: 16px; line-height: 1.6;">Stay connected with us on our social media platforms for more engaging content.</p>' +
            '<p style="font-size: 16px; line-height: 1.6;">Best regards,<br>The Telugu Info Team</p>' +
            '</div>'
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