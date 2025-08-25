import { useState } from "react";
import { createPaymentPdf } from "../../utils/createPaymentPdf";
import { toast } from "react-toastify";

export const usePaymentRequestForm = () => {
  const now = new Date();
  const [paymentDate, setPaymentDate] = useState<Date>(
    new Date(now.getFullYear(), now.getMonth())
  );

  const handleSubmit = async (data: any) => {
    const date =
      paymentDate &&
      `${paymentDate.getMonth() + 1}/${paymentDate.getFullYear()}`;

    const fullData = {
      ...data,
      date,
    };

    try {
      await createPaymentPdf(fullData);
      toast.success("ה־PDF נוצר בהצלחה!");
      setPaymentDate(new Date(now.getFullYear(), now.getMonth()));
    } catch (err) {
      console.error(err);
      toast.error("אירעה שגיאה ביצירת ה־PDF");
    }
  };

  return {
    handleSubmit,
    paymentDate,
    setPaymentDate,
  };
};
