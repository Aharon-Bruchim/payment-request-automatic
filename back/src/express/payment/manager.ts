import puppeteer from 'puppeteer';
import path from 'path';
import { readFile, access } from 'fs/promises';
import { constants as fsConstants } from 'fs';
import { pathToFileURL } from 'url';
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

function resolveAssetsDir() {
    const dist = path.resolve(__dirname, '../../assets');
    const src = path.resolve(process.cwd(), 'src/assets');
    return [dist, src];
}

async function getFontUrl() {
    for (const base of resolveAssetsDir()) {
        const p = path.join(base, 'fonts', 'Assistant-Regular.ttf');
        try {
            await access(p, fsConstants.R_OK);
            return pathToFileURL(p).toString();
        } catch {}
    }
    throw new Error('Assistant-Regular.ttf not found under dist/assets/fonts or src/assets/fonts');
}

async function getBackgroundDataUrl() {
    for (const base of resolveAssetsDir()) {
        const p = path.join(base, 'background_pdf.png');
        try {
            await access(p, fsConstants.R_OK);
            const b = await readFile(p);
            return `data:image/png;base64,${b.toString('base64')}`;
        } catch {}
    }
    return '';
}

function buildStyledHtmlForPdf(p: PaymentFormData, fontUrl: string, bgDataUrl: string) {
    return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
@font-face { font-family: "Assistant"; src: url("${fontUrl}") format("truetype"); font-weight: 400; font-style: normal; }
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family: Assistant, Arial, sans-serif; background:#f3f4f6}
.wrap{width:100%; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:32px}
.paper{width:90%; max-width:700px; position:relative; background:#fff; border-radius:16px; padding:32px; overflow:hidden; box-shadow:0 4px 16px rgba(0,0,0,.1)}
.bg{position:absolute; inset:0; background-image:url('${bgDataUrl}'); background-repeat:no-repeat; background-position:center; background-size:cover; opacity:.3; z-index:0}
.content{position:relative; z-index:1; direction:rtl; text-align:right}
.h1{margin:0 0 16px; font-size:22px; font-weight:700; color:#1976d2; text-align:center}
.row{margin:6px 0; font-size:16px}
.box{margin-top:18px; border:1px solid #bbb; border-radius:10px; padding:12px}
</style>
</head>
<body>
  <div class="wrap">
    <div class="paper">
      <div class="bg"></div>
      <div class="content">
        <div class="h1">בקשת תשלום עבור ${p.clientName} תאריך: ${p.date}</div>
        <div class="row">💰 סכום לתשלום: ${p.amount} ₪</div>
        <div class="row">📆 תאריך: ${p.date || 'לא הוזן'}</div>
        <div class="row">👨‍🎓 מספר תלמידים: ${p.studentCount}</div>
        <div class="row">📚 מספר שיעורים: ${p.sessionCount}</div>
        <div class="row">📝 הערות: ${p.comments || '—'}</div>
        <div class="box">
          <div class="row">🧾 פרטי בנק להעברה:</div>
          <div class="row">🏦 בנק: ${p.bank}</div>
          <div class="row">🏢 סניף: ${p.branch}</div>
          <div class="row">📄 מספר חשבון: ${p.account}</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function createPaymentPdfBuffer(p: PaymentFormData): Promise<Buffer> {
    const fontUrl = await getFontUrl();
    const bg = await getBackgroundDataUrl();
    const html = buildStyledHtmlForPdf(p, fontUrl, bg);

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfData = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
    });

    await browser.close();
    return Buffer.isBuffer(pdfData) ? pdfData : Buffer.from(pdfData);
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
            html: buildHtmlEmail(payment),
            attachments: [{ filename, content: pdfBuffer, contentType: 'application/pdf' }],
        });
        return { ok: true, messageId: info.messageId };
    }
}
