import nodemailer from 'nodemailer';

export async function sendEmail(recipientEmail: string, bookPDF: Buffer): Promise<void> {
  // Configure the email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: 'Your Purchase - Beginner To Composer In 14 Days - PDF Book',
    text: 'Thank you for buying our book! Please feel free to get in touch to share your compositions!!',
    attachments: [
      {
        filename: 'book.pdf',
        content: bookPDF,
        contentType: 'application/pdf',
      },
    ],
  };

  try {await transporter.sendMail(mailOptions);} 
  catch (error) {throw new Error('Failed to send PDF email');}
}