import React from "react";
import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

interface PaymentDatePickerProps {
  years: number[];
}

export const PaymentDatePicker: React.FC<PaymentDatePickerProps> = ({
  years,
}) => {
  return (
    <div>
      <Typography variant="subtitle1" sx={{ textAlign: "right", mb: 1 }}>
        תאריך תשלום
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} component="div" {...({} as any)}>
          <FormControl fullWidth>
            <Select name="paymentDate" required defaultValue="" displayEmpty>
              <MenuItem value="" disabled>
                בחר חודש
              </MenuItem>
              {[
                "01|ינואר",
                "02|פברואר",
                "03|מרץ",
                "04|אפריל",
                "05|מאי",
                "06|יוני",
                "07|יולי",
                "08|אוגוסט",
                "09|ספטמבר",
                "10|אוקטובר",
                "11|נובמבר",
                "12|דצמבר",
              ].map((item) => {
                const [value, label] = item.split("|");
                return (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} component="div" {...({} as any)}>
          <FormControl fullWidth>
            <Select name="paymentYear" required defaultValue="" displayEmpty>
              <MenuItem value="" disabled>
                בחר שנה
              </MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};
