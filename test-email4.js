const { Recipient, EmailParams, MailerSend } = require("mailersend");

const mailersend = new MailerSend({
    apiKey: "mlsn.137d6ae132245845965335fc1bab5a88136e612ec74b2d47f2ee031cf9aec597", // Replace with your actual MailerSend API key
});

const recipients = [new Recipient("marothihemasundar03@gmail.com", "Hemasundar")]; // Replace with actual recipient

const emailParams = new EmailParams()
    .setFrom("marotinani06@gmail.com") // Replace with your verified sender
    .setFromName("Telugu Info")
    .setRecipients(recipients)
    .setSubject("🌟 We Value Your Feedback - Help Us Improve!")
    .setHtml("Greetings from the team, you got this message through MailerSend.")
    .setText("Greetings from the team, you got this message through MailerSend.");

mailersend.send(emailParams)
    .then(response => {
        console.log("Email sent successfully!", response);
    })
    .catch(error => {
        console.error("Failed to send email:", error);
    });

