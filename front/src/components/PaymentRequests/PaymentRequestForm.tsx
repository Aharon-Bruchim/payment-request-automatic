import { useRef, useState } from "react";
import { Button, Container, TextField, Typography, Box } from "@mui/material";
import html2pdf from "html2pdf.js";

import { PaymentFormData } from "../../types/formData";
import { contactsApi } from "../../services/contactsApi";
import { StyledPaymentPreview } from "./StyledPaymentPreview";
interface Props {
  clientName: string;
  clientEmail: string;
}

export const PaymentRequestForm: React.FC<Props> = ({
  clientName,
  clientEmail,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<PaymentFormData | null>(null);
  const now = new Date();
  const defaultDate = `${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}.${now.getFullYear()}`;

  const bankDetails = {
    bank: "הפועלים (12)",
    branch: "698",
    account: "66806",
  };

  const [formValues, setFormValues] = useState<PaymentFormData>({
    amount: null,
    bank: bankDetails.bank,
    branch: bankDetails.branch,
    account: bankDetails.account,
    date: defaultDate,
    studentCount: null,
    sessionCount: null,
    comments: "",
    clientName: clientName,
    clientEmail: clientEmail,
  });

  const isFormValid = () => {
    const amount = Number(formValues.amount ?? 0);
    const students = Number(formValues.studentCount ?? 0);
    const sessions = Number(formValues.sessionCount ?? 0);
    return amount > 0 && students > 0 && sessions > 0;
  };

  const openServer = async () => {
    try {
      const fullData = { ...formValues };
      setFormData(fullData);

      setTimeout(async () => {
        if (previewRef.current) {
          const pdfBlob = await html2pdf()
            .from(previewRef.current)
            .set({
              margin: 1,
              html2canvas: { scale: 2 },
              jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .outputPdf("blob");

          const formData = new FormData();
          formData.append("pdfFile", pdfBlob, "payment.pdf");
          formData.append("amount", fullData.amount!.toString());
          formData.append("bank", fullData.bank);
          formData.append("branch", fullData.branch);
          formData.append("account", fullData.account);
          formData.append("date", fullData.date);
          formData.append("studentCount", fullData.studentCount!.toString());
          formData.append("sessionCount", fullData.sessionCount!.toString());
          formData.append("clientName", fullData.clientName);
          formData.append("clientEmail", fullData.clientEmail);
          if (fullData.comments) formData.append("comments", fullData.comments);

          await contactsApi.create(formData);
        }
      }, 100);
    } catch (error: any) {
      console.error("Full error:", error.response?.data || error);
    }
  };
  return (
    <Container maxWidth="sm">
      <form>
        <TextField
          fullWidth
          label="סכום"
          name="amount"
          required
          margin="normal"
          type="number"
          value={formValues.amount ?? ""}
          onChange={(e) =>
            setFormValues({ ...formValues, amount: Number(e.target.value) })
          }
        />
        <Box my={2}>
          <Typography variant="subtitle2" fontWeight="bold">
            פרטי בנק:
          </Typography>
          <Typography>🏦 בנק: {bankDetails.bank}</Typography>
          <Typography>🏢 סניף: {bankDetails.branch}</Typography>
          <Typography>📄 חשבון: {bankDetails.account}</Typography>
        </Box>

        <input type="hidden" name="bank" value={bankDetails.bank} />
        <input type="hidden" name="branch" value={bankDetails.branch} />
        <input type="hidden" name="account" value={bankDetails.account} />

        <TextField
          fullWidth
          label="תאריך תשלום"
          name="date"
          margin="normal"
          value={formValues.date}
          onChange={(e) =>
            setFormValues({ ...formValues, date: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="מספר תלמידים"
          name="studentCount"
          type="number"
          required
          margin="normal"
          value={formValues.studentCount ?? ""}
          onChange={(e) =>
            setFormValues({
              ...formValues,
              studentCount: Number(e.target.value),
            })
          }
        />
        <TextField
          fullWidth
          label="מספר שיעורים"
          name="sessionCount"
          type="number"
          required
          margin="normal"
          value={formValues.sessionCount ?? ""}
          onChange={(e) =>
            setFormValues({
              ...formValues,
              sessionCount: Number(e.target.value),
            })
          }
        />
        <TextField
          fullWidth
          label="הערות"
          name="comments"
          multiline
          rows={2}
          margin="normal"
          value={formValues.comments}
          onChange={(e) =>
            setFormValues({ ...formValues, comments: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="שם הלקוח"
          name="clientName"
          required
          margin="normal"
          value={formValues.clientName}
          inputProps={{
            readOnly: true,
            style: {
              backgroundColor: "#f5f5f5",
              color: "#888",
              cursor: "not-allowed",
            },
          }}
        />
        <TextField
          fullWidth
          label="אימייל הלקוח"
          name="clientEmail"
          margin="normal"
          value={formValues.clientEmail}
          inputProps={{
            readOnly: true,
            style: {
              backgroundColor: "#f5f5f5",
              color: "#888",
              cursor: "not-allowed",
            },
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button
            onClick={openServer}
            variant="outlined"
            color="success"
            disabled={!isFormValid()}
            sx={{
              width: "calc(50% - 8px)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            שרת
          </Button>
        </Box>
      </form>
      {formData && (
        <div style={{ display: "none" }}>
          <StyledPaymentPreview ref={previewRef} data={formData} />
        </div>
      )}
    </Container>
  );
};
