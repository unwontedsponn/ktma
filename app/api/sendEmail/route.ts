import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    const { email, subject, message } = await req.json();

    if (!email || !subject || !message) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Contact Form" <${email}>`,
            to: 'benpaulspooner@gmail.com',
            subject,
            text: message,
        });

        return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Email failed to send', error },
            { status: 500 }
        );
    }
}
