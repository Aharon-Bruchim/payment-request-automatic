import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { Layout } from "./components/Layout/Layout";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { AppLoader } from "./components/common/AppLoader";
import AppRoutes from "./components/AppRoutes/AppRoutes";

export default function App() {
  return (
    <>
      <ErrorBoundary>
        <Layout>
          <Suspense fallback={<AppLoader />}>
            <AppRoutes />
          </Suspense>
        </Layout>
      </ErrorBoundary>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={2}
        newestOnTop
        closeOnClick
      />
    </>
  );
}
