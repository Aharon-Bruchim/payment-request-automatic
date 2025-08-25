import { forwardRef } from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";

interface Props {
  data: any;
}

export const StyledPaymentPreview = forwardRef<HTMLDivElement, Props>(
  ({ data }, ref) => (
    <Box
      ref={ref}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundSize: "cover",
        paddingY: 6,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "90%",
          p: 4,
          borderRadius: 3,
          background: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: 'url("/background_pdf.png")',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
            opacity: 0.3,
            zIndex: 0,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            color="primary"
            textAlign="center"
          >
            בקשת תשלום עבור {data.clientName} תאריך: {data.date}
          </Typography>

          <Stack spacing={1} dir="rtl">
            <Typography>💰 סכום לתשלום: {data.amount} ₪</Typography>
            <Typography>📆 תאריך: {data.date || "לא הוזן"}</Typography>
            <Typography>👨‍🎓 מספר תלמידים: {data.studentCount}</Typography>
            <Typography>📚 מספר שיעורים: {data.sessionCount}</Typography>
            <Typography>📝 הערות: {data.comments}</Typography>

            <Box
              sx={{
                // backgroundColor: "#f9f9f9",
                border: "1px solid #bbb",
                borderRadius: 2,
                p: 2,
                mt: 3,
                textAlign: "right",
              }}
            >
              <Typography>🧾 פרטי בנק להעברה:</Typography>
              <Typography>🏦 בנק: {data.bank}</Typography>
              <Typography>🏢 סניף: {data.branch}</Typography>
              <Typography>📄 מספר חשבון: {data.account}</Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
);
