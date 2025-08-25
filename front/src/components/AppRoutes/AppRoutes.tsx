import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const ContactsPage = lazy(
  () => import("../../pages/ContactsPage/ContactsPage")
);
const NewContactForm = lazy(
  () => import("../../components/Contacts/NewContactForm/NewContactForm")
);
const PaymentRequestsPage = lazy(
  () => import("../../pages/PaymentRequestsPage/PaymentRequestsPage")
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/contacts" replace />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/contacts/new" element={<NewContactForm />} />
      <Route path="/requests" element={<PaymentRequestsPage />} />
    </Routes>
  );
}
