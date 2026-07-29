import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import PageLoader from "./components/ui/PageLoader";
import DecorativeBg from "./components/ui/DecorativeBg";
import ProtectedRoute, { GuestRoute } from "./routes/ProtectedRoute";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const OtpVerificationPage = lazy(() => import("./pages/OtpVerificationPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const AllPollsPage = lazy(() => import("./pages/AllPollsPage"));
const MyPollsPage = lazy(() => import("./pages/MyPollsPage"));
const CreatePollPage = lazy(() => import("./pages/CreatePollPage"));
const PollDetailsPage = lazy(() => import("./pages/PollDetailsPage"));
const EditPollPage = lazy(() => import("./pages/EditPollPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const EditProfilePage = lazy(() => import("./pages/EditProfilePage"));
const PublicProfilePage = lazy(() => import("./pages/PublicProfilePage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DecorativeBg />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />

              <Route element={<GuestRoute />}>
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/verify-otp" element={<OtpVerificationPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="home" replace />} />
                  <Route path="home" element={<HomePage />} />
                  <Route path="polls" element={<AllPollsPage />} />
                  <Route path="polls/mine" element={<MyPollsPage />} />
                  <Route path="polls/create" element={<CreatePollPage />} />
                  <Route path="polls/:id" element={<PollDetailsPage />} />
                  <Route path="polls/:id/edit" element={<EditPollPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="profile/edit" element={<EditProfilePage />} />
                  <Route path="profile/:username" element={<PublicProfilePage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              className: "text-sm",
              style: {
                background: "var(--card)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
