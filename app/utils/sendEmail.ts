import nodemailer from 'nodemailer';

// Update the sendEmail function to accept four arguments: recipientEmail, bookPDF, subject, and text.
export async function sendEmail(recipientEmail: string, bookPDF: Buffer, subject: string, text: string): Promise<void> {
  // Configure the email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define the email options including subject and text
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: subject, // Use the subject argument
    text: text,       // Use the text argument
    attachments: [
      {
        filename: 'Beginner to Composer.pdf', // Appropriately named file
        content: bookPDF,
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`); // Log the response for debugging
  } catch (error) {
    console.error('Failed to send PDF email:', error); // Log the error for debugging
    throw new Error('Failed to send PDF email'); // Throw a generic error for further handling
  }
}
