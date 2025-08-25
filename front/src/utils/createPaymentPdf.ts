import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import fontkit from "@pdf-lib/fontkit";
import { PaymentFormData } from "../types/formData";

export const createPaymentPdf = async (formData: PaymentFormData) => {
  const fontBytes = await fetch("/fonts/Assistant-Regular.ttf").then((res) =>
    res.arrayBuffer()
  );

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(fontBytes);

  const page = pdfDoc.addPage([595, 842]);
  const { height } = page.getSize();

  let y = height - 60;

  const drawRightText = (label: string, value?: string | number, size = 14) => {
    const hasValue = value !== undefined && value !== null && value !== "";
    const text = hasValue ? `${label}: ${value}` : label;
    page.drawText(text, { x: 50, y, size, font, color: rgb(0, 0, 0) });
    y -= size + 10;
  };

  page.drawText("בקשת תשלום", {
    x: 50,
    y,
    size: 24,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 40;

  drawRightText("סכום", formData.amount + " ₪");
  drawRightText("בנק", formData.bank);
  drawRightText("סניף", formData.branch);
  drawRightText("מספר חשבון", formData.account);
  drawRightText("תאריך תשלום", formData.date || "לא הוזן");
  drawRightText("מספר תלמידים", formData.studentCount);
  drawRightText("מספר שיעורים", formData.sessionCount);
  drawRightText("הערות", formData.comments || "—");
  drawRightText("שם הלקוח", formData.clientName);

  const pdfBytes = await pdfDoc.save();
  saveAs(
    new Blob([pdfBytes], { type: "application/pdf" }),
    `בקשת_תשלום_${formData.clientName}.pdf`
  );
};
