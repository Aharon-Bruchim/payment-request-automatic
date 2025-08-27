import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { readFile, access } from 'fs/promises';
import { constants as fsConstants } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { PaymentFormData } from './interface';

const { GMAIL_SENDER, GMAIL_APP_PASSWORD } = process.env;

function buildText(p: PaymentFormData) {
    const comments = p.comments && p.comments.trim() !== '' ? p.comments : '-';
    return [
        'שלום,',
        '',
        `בקשת תשלום עבור ${p.clientName} בסך ${p.amount} ₪.`,
        '',
        `📅 תאריך: ${p.date}`,
        `👨‍🏫 מספר תלמידים: ${p.studentCount}`,
        `📚 מספר שיעורים: ${p.sessionCount}`,
        `💬 הערות: ${comments}`,
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

function buildHtml(p: PaymentFormData) {
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<div dir="rtl" style="font-family: Arial, sans-serif; font-size:16px; line-height:1.7; white-space:pre-wrap;">${esc(buildText(p))}</div>`;
}

async function getTransporter() {
    if (!GMAIL_SENDER || !GMAIL_APP_PASSWORD) {
        throw new Error('Missing GMAIL_SENDER or GMAIL_APP_PASSWORD in env');
    }
    return nodemailer.createTransport({
        service: 'gmail',
        auth: { user: GMAIL_SENDER, pass: GMAIL_APP_PASSWORD },
    });
}

export async function createPaymentPdfBuffer(p: PaymentFormData): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const fontPath = path.resolve(__dirname, '../../assets/fonts/Assistant-Regular.ttf');
    await access(fontPath, fsConstants.R_OK);
    const fontBytes = await readFile(fontPath);
    const font = await pdfDoc.embedFont(fontBytes);

    const page = pdfDoc.addPage([595, 842]);
    const { height } = page.getSize();
    let y = height - 60;

    const drawText = (text: string, size = 14) => {
        page.drawText(text, { x: 50, y, size, font, color: rgb(0, 0, 0) });
        y -= size + 10;
    };

    page.drawText('בקשת תשלום', { x: 50, y, size: 24, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 40;

    drawText(`סכום: ${p.amount} ₪`);
    drawText(`בנק: ${p.bank}`);
    drawText(`סניף: ${p.branch}`);
    drawText(`מספר חשבון: ${p.account}`);
    drawText(`תאריך תשלום: ${p.date || 'לא הוזן'}`);
    drawText(`מספר תלמידים: ${p.studentCount}`);
    drawText(`מספר שיעורים: ${p.sessionCount}`);
    drawText(`הערות: ${p.comments || '—'}`);
    drawText(`שם הלקוח: ${p.clientName}`);

    const bytes = await pdfDoc.save();
    return Buffer.from(bytes);
}

export class PaymentManager {
    static async createOne(payment: PaymentFormData) {
        const pdfBuffer = await createPaymentPdfBuffer(payment);
        const filename = `בקשת_תשלום_${payment.clientName}_${payment.date}.pdf`;
        const transporter = await getTransporter();
        const info = await transporter.sendMail({
            from: GMAIL_SENDER,
            to: payment.clientEmail,
            replyTo: GMAIL_SENDER,
            subject: `בקשת תשלום - ${payment.clientName} - ${payment.amount} ₪`,
            text: buildText(payment),
            html: buildHtml(payment),
            attachments: [{ filename, content: pdfBuffer, contentType: 'application/pdf' }],
        });
        return { ok: true, messageId: info.messageId };
    }
}
