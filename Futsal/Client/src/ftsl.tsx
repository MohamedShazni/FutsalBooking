import HomePage from "./pages/home";
import ContactPage from "./pages/contact";
import BookingPage from "./pages/booking";
import ConfirmationPage from "./pages/confirmation";
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
      </Routes>
    </>
  );
};

export default FutsalBooking;
