import nodemailer from 'nodemailer';
import { PaymentFormData } from './interface';

const { GMAIL_SENDER, GMAIL_APP_PASSWORD } = process.env;

function buildText(p: PaymentFormData) {
    const c = p.comments && p.comments.trim() !== '' ? p.comments : '-';
    return [
        'שלום,',
        '',
        `בקשת תשלום עבור ${p.clientName} בסך ${p.amount} ₪.`,
        '',
        `📅 תאריך: ${p.date}`,
        `👨‍🏫 מספר תלמידים: ${p.studentCount}`,
        `📚 מספר שיעורים: ${p.sessionCount}`,
        `💬 הערות: ${c}`,
        '',
        'פרטי בנק:',
        `🏦 בנק: ${p.bank}`,
        `🏢 סניף: ${p.branch}`,
        `📄 חשבון: ${p.account}`,
        '',
        'מצורף PDF עם פרטי הבקשה.',
        'תודה רבה!',
    ].join('\n');
}

function buildHtmlEmail(p: PaymentFormData) {
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<div dir="rtl" style="font-family: Arial, sans-serif; font-size:16px; line-height:1.7; white-space:pre-wrap;">${esc(buildText(p))}</div>`;
}

async function getTransporter() {
    if (!GMAIL_SENDER || !GMAIL_APP_PASSWORD) throw new Error('Missing GMAIL_SENDER or GMAIL_APP_PASSWORD in env');
    return nodemailer.createTransport({ service: 'gmail', auth: { user: GMAIL_SENDER, pass: GMAIL_APP_PASSWORD } });
}

export class PaymentManager {
    static async createOne(payment: PaymentFormData, pdfBuffer: Buffer) {
        const filename = `בקשת_תשלום_${payment.clientName}_${payment.date}.pdf`;
        const transporter = await getTransporter();
        const info = await transporter.sendMail({
            from: GMAIL_SENDER,
            to: payment.clientEmail,
            replyTo: GMAIL_SENDER,
            subject: `בקשת תשלום - ${payment.clientName} - ${payment.amount} ₪`,
            text: buildText(payment),
            html: buildHtmlEmail(payment),
            attachments: [{ filename, content: pdfBuffer, contentType: 'application/pdf' }],
        });
        return { ok: true, messageId: info.messageId };
    }
}
