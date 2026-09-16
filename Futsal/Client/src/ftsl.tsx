import HomePage from "./pages/home";
import ContactPage from "./pages/contact";
import BookingPage from "./pages/booking";
import ConfirmationPage from "./pages/confirmation";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { Route, Routes } from "react-router";

const FutsalBooking = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        {/* Support previous /payment route if bookmarked */}
        <Route path="/payment" element={<ConfirmationPage />} />
        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </>
  );
};

export default FutsalBooking;
