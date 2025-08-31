import { useRef, useState } from "react";
import { Button, Container, TextField, Typography, Box } from "@mui/material";
import { StyledPaymentPreview } from "./StyledPaymentPreview";
import { useMail } from "../../hooks/useMail";
import { useIsAlive } from "../../hooks/useIsAlive";

interface Props {
  clientName: string;
  clientEmail: string;
}

export const PaymentRequestForm: React.FC<Props> = ({
  clientName,
  clientEmail,
}) => {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const { formValues, setFormValues, openServer, bankDetails } = useMail({
    clientName,
    clientEmail,
  });
  const { isLoading, isSuccess, isError } = useIsAlive();

  const [errors, setErrors] = useState<{
    amount?: string | null;
    studentCount?: string | null;
    sessionCount?: string | null;
  }>({});

  const isFormValid = () => {
    const amount = formValues.amount ?? 0;
    const students = formValues.studentCount ?? 0;
    const sessions = formValues.sessionCount ?? 0;
    return amount > 0 && students > 0 && sessions > 0;
  };

  const getButtonState = () => {
    const formValid = isFormValid();

    if (!formValid) {
      return {
        disabled: true,
        text: "מלא את כל השדות",
        backgroundColor: "#9e9e9e",
        color: "#ffffff",
      };
    }

    if (isLoading) {
      return {
        disabled: true,
        text: "השרת מתעורר",
        backgroundColor: "#ff9800",
        color: "#ffffff",
      };
    }

    if (isError) {
      return {
        disabled: true,
        text: "בעיה בשרת - יש לחכות",
        backgroundColor: "#f44336",
        color: "#ffffff",
      };
    }

    if (isSuccess) {
      return {
        disabled: false,
        text: "שלח מייל",
        backgroundColor: "#4caf50",
        color: "#ffffff",
      };
    }

    return {
      disabled: true,
      text: "ממתין...",
      backgroundColor: "#9e9e9e",
      color: "#ffffff",
    };
  };

  const handleOpenServer = () => openServer(previewRef);
  const buttonState = getButtonState();

  const handleNumberChange =
    (field: "amount" | "studentCount" | "sessionCount") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const num = Number(value);

      if (value !== "" && isNaN(num)) {
        setErrors({ ...errors, [field]: "אנא הקלד מספר בלבד" });
        setFormValues({ ...formValues, [field]: null });
      } else {
        setErrors({ ...errors, [field]: null });
        setFormValues({ ...formValues, [field]: value === "" ? null : num });
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
          type="tel"
          inputMode="numeric"
          InputLabelProps={{
            sx: { "& .MuiFormLabel-asterisk": { color: "red" } },
          }}
          value={formValues.amount ?? ""}
          onChange={handleNumberChange("amount")}
          error={!!errors.amount}
          helperText={errors.amount}
        />

        <Box my={2}>
          <Typography variant="subtitle2" fontWeight="bold">
            פרטי בנק:
          </Typography>
          <Typography>🏦 בנק: {bankDetails.bank}</Typography>
          <Typography>🏢 סניף: {bankDetails.branch}</Typography>
          <Typography>📄 חשבון: {bankDetails.account}</Typography>
        </Box>

        <TextField
          fullWidth
          required
          label="תאריך תשלום"
          name="date"
          margin="normal"
          InputLabelProps={{
            sx: { "& .MuiFormLabel-asterisk": { color: "red" } },
          }}
          value={formValues.date}
          onChange={(e) =>
            setFormValues({ ...formValues, date: e.target.value })
          }
        />

        <TextField
          fullWidth
          label="מספר תלמידים"
          name="studentCount"
          required
          margin="normal"
          type="tel"
          inputMode="numeric"
          InputLabelProps={{
            sx: { "& .MuiFormLabel-asterisk": { color: "red" } },
          }}
          value={formValues.studentCount ?? ""}
          onChange={handleNumberChange("studentCount")}
          error={!!errors.studentCount}
          helperText={errors.studentCount}
        />

        <TextField
          fullWidth
          label="מספר שיעורים"
          name="sessionCount"
          required
          margin="normal"
          type="tel"
          inputMode="numeric"
          InputLabelProps={{
            sx: { "& .MuiFormLabel-asterisk": { color: "red" } },
          }}
          value={formValues.sessionCount ?? ""}
          onChange={handleNumberChange("sessionCount")}
          error={!!errors.sessionCount}
          helperText={errors.sessionCount}
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
          InputLabelProps={{
            sx: { "& .MuiFormLabel-asterisk": { color: "red" } },
          }}
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
          required
          label="אימייל הלקוח"
          name="clientEmail"
          margin="normal"
          InputLabelProps={{
            sx: { "& .MuiFormLabel-asterisk": { color: "red" } },
          }}
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

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            onClick={handleOpenServer}
            variant="contained"
            disabled={buttonState.disabled}
            sx={{
              width: "calc(50% - 8px)",
              backgroundColor: buttonState.backgroundColor,
              color: buttonState.color,
              transition: "all 0.3s ease",
              "&:hover": buttonState.disabled
                ? {}
                : {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    backgroundColor:
                      buttonState.backgroundColor === "#4caf50"
                        ? "#45a049"
                        : buttonState.backgroundColor === "#ff9800"
                        ? "#e68900"
                        : buttonState.backgroundColor === "#f44336"
                        ? "#da190b"
                        : "#757575",
                  },
              "&:disabled": {
                backgroundColor: buttonState.backgroundColor,
                color: buttonState.color,
                opacity: buttonState.disabled ? 0.8 : 1,
              },
            }}
          >
            {buttonState.text}
          </Button>
        </Box>
      </form>

      {formValues && (
        <div style={{ display: "none" }}>
          <StyledPaymentPreview ref={previewRef} data={formValues} />
        </div>
      )}
    </Container>
  );
};
