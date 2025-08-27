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
<style>
@page { size: A4; margin: 0 }
@font-face { font-family: "Assistant"; src: url("${fontUrl}") format("truetype"); font-weight: 400; font-style: normal; }
*{box-sizing:border-box}
html,body{margin:0;padding:0;height:100%}
body{font-family: Assistant, Arial, sans-serif; background:#f3f4f6}
.page{width:210mm;height:297mm;display:flex;align-items:flex-start;justify-content:center;padding:15mm}
.card{width:100%;border-radius:16px;background:#fff;position:relative;overflow:hidden;padding:16mm;box-shadow:0 4px 16px rgba(0,0,0,.12)}
.bg{position:absolute;inset:0;background-image:url('${bgDataUrl}');background-repeat:no-repeat;background-position:center;background-size:cover;opacity:.28;z-index:0}
.content{position:relative;z-index:1;direction:rtl;text-align:right}
.title{margin:0 0 10mm;font-size:22px;font-weight:700;color:#1976d2;text-align:right}
.rows{display:grid;grid-auto-rows:min-content;row-gap:4mm}
.row{display:grid;grid-template-columns:20px 1fr;align-items:center;column-gap:4mm;font-size:16px}
.ico{grid-column:1/2;justify-self:end}
.txt{grid-column:2/3}
.box{margin-top:8mm;border:1px solid #bbb;border-radius:10px;padding:6mm}
</style>
</head>
<body>
  <div class="page">
    <div class="card">
      <div class="bg"></div>
      <div class="content">
        <h1 class="title">תאריך: ${p.date} &nbsp; בקשת תשלום עבור ${p.clientName}</h1>
        <div class="rows">
          <div class="row"><div class="ico">💰</div><div class="txt">סכום לתשלום: ${p.amount} ₪</div></div>
          <div class="row"><div class="ico">📆</div><div class="txt">תאריך: ${p.date || 'לא הוזן'}</div></div>
          <div class="row"><div class="ico">👨‍🎓</div><div class="txt">מספר תלמידים: ${p.studentCount}</div></div>
          <div class="row"><div class="ico">📚</div><div class="txt">מספר שיעורים: ${p.sessionCount}</div></div>
          <div class="row"><div class="ico">📝</div><div class="txt">הערות: ${p.comments || '—'}</div></div>
        </div>
        <div class="box">
          <div class="row"><div class="ico">🧾</div><div class="txt">פרטי בנק להעברה:</div></div>
          <div class="row"><div class="ico">🏦</div><div class="txt">בנק: ${p.bank}</div></div>
          <div class="row"><div class="ico">🏢</div><div class="txt">סניף: ${p.branch}</div></div>
          <div class="row"><div class="ico">📄</div><div class="txt">מספר חשבון: ${p.account}</div></div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function createPaymentPdfBuffer(p: PaymentFormData): Promise<Buffer> {
    const fontUrl = await getFontUrl();
    const bg = await getBackgroundDataUrl();
    const html = buildStyledHtmlForPdf(p, fontUrl, bg);

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: (puppeteer as any).executablePath?.(),
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const data = await page.pdf({ printBackground: true, preferCSSPageSize: true });

    await browser.close();
    return Buffer.from(data);
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
