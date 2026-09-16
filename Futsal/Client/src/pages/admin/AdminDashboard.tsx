import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "../../socket";
import { AdminLayout } from "./AdminLayout";
import { OverviewView } from "./components/OverviewView";
import { CourtManager } from "./components/CourtManager";
import { BookingManager } from "./components/BookingManager";
import { ScheduleMatrix } from "./components/ScheduleMatrix";
import { PricingSettings } from "./components/PricingSettings";
import { CustomerDirectory } from "./components/CustomerDirectory";
import { AnalyticsView } from "./components/AnalyticsView";
import { SettingsView } from "./components/SettingsView";
import { CourtModal } from "./components/CourtModal";
import { ManualBookingModal } from "./components/ManualBookingModal";
import { Court, Booking, AdminStats, NotificationItem } from "./types";

const AdminDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("overview");
  const [courts, setCourts] = useState<Court[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(socket.connected);

  // Modals state
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [manualBookingPreset, setManualBookingPreset] = useState<{
    courtId?: number;
    date?: string;
    time?: string;
    customerName?: string;
    customerMobile?: string;
  }>({});

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [courtsRes, bookingsRes, statsRes] = await Promise.all([
        axios.get("http://localhost:3001/api/courts"),
        axios.get("http://localhost:3001/api/bookings"),
        axios.get("http://localhost:3001/api/admin/stats"),
      ]);

      setCourts(courtsRes.data || []);
      setBookings(bookingsRes.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      console.error("Error loading admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Socket status
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Real-time booking updates
    socket.on("booking_update", (data: any) => {
      console.log("Socket booking update received:", data);
      fetchData();
    });

    // Real-time court updates
    socket.on("court_update", (data: any) => {
      console.log("Socket court update received:", data);
      fetchData();
    });

    // Real-time notifications
    socket.on("admin_notification", (data: any) => {
      console.log("Admin notification received:", data);
      const newNotif: NotificationItem = {
        id: "notif_" + Date.now(),
        title: "New Online Booking Alert!",
        message:
          data.message ||
          `Booking for ${data.details?.courtName || "Court"} at ${data.details?.time || ""}`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        read: false,
        type: "booking",
        data: data.details,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("booking_update");
      socket.off("court_update");
      socket.off("admin_notification");
    };
  }, []);

  // Court Operations
  const handleSaveCourt = async (courtData: Partial<Court>) => {
    if (editingCourt) {
      // Update
      await axios.put(
        `http://localhost:3001/api/courts/${editingCourt.courtId}`,
        courtData,
      );
    } else {
      // Create
      await axios.post("http://localhost:3001/api/courts", courtData);
    }
    fetchData();
  };

  const handleToggleCourtStatus = async (
    court: Court,
    nextStatus: "Active" | "Maintenance" | "Inactive",
  ) => {
    try {
      await axios.put(`http://localhost:3001/api/courts/${court.courtId}`, {
        status: nextStatus,
      });
      fetchData();
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleDeleteCourt = async (courtId: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/courts/${courtId}`);
      fetchData();
    } catch (err: any) {
      alert("Failed to delete court: " + err.message);
    }
  };

  // Booking Operations
  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: "CONFIRMED" | "CANCELLED" | "COMPLETED",
    paymentStatus?: "Paid" | "Pending" | "Pay at Venue",
  ) => {
    try {
      await axios.put(`http://localhost:3001/api/bookings/${bookingId}`, {
        status,
        ...(paymentStatus && { paymentStatus }),
      });
      fetchData();
    } catch (err: any) {
      alert("Failed to update booking: " + err.message);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/bookings/${bookingId}`);
      fetchData();
    } catch (err: any) {
      alert("Failed to delete booking: " + err.message);
    }
  };

  // Bulk Pricing
  const handleBulkUpdatePricing = async (
    basePrice: number,
    peakPrice: number,
  ) => {
    await Promise.all(
      courts.map((court) =>
        axios.put(`http://localhost:3001/api/courts/${court.courtId}`, {
          basePrice,
          peakPrice,
        }),
      ),
    );
    fetchData();
  };

  // Notification actions
  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  // Quick Open Modal helpers
  const handleOpenAddCourt = () => {
    setEditingCourt(null);
    setIsCourtModalOpen(true);
  };

  const handleOpenEditCourt = (court: Court) => {
    setEditingCourt(court);
    setIsCourtModalOpen(true);
  };

  const handleOpenManualBooking = (preset?: {
    courtId?: number;
    date?: string;
    time?: string;
    customerName?: string;
    customerMobile?: string;
  }) => {
    setManualBookingPreset(preset || {});
    setIsManualBookingOpen(true);
  };

  return (
    <AdminLayout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onOpenManualBooking={() => handleOpenManualBooking()}
      onOpenAddCourt={handleOpenAddCourt}
      isConnected={isConnected}
      notifications={notifications}
      onClearNotifications={handleClearNotifications}
      onMarkNotificationRead={handleMarkNotificationRead}
    >
      {/* Tab Views */}
      {currentTab === "overview" && (
        <OverviewView
          stats={stats}
          bookings={bookings}
          courts={courts}
          onOpenManualBooking={() => handleOpenManualBooking()}
          onOpenAddCourt={handleOpenAddCourt}
          onSelectTab={setCurrentTab}
          onUpdateBookingStatus={handleUpdateBookingStatus}
        />
      )}

      {currentTab === "courts" && (
        <CourtManager
          courts={courts}
          onOpenAddModal={handleOpenAddCourt}
          onOpenEditModal={handleOpenEditCourt}
          onToggleStatus={handleToggleCourtStatus}
          onDeleteCourt={handleDeleteCourt}
        />
      )}

      {currentTab === "bookings" && (
        <BookingManager
          bookings={bookings}
          courts={courts}
          onOpenManualBooking={() => handleOpenManualBooking()}
          onUpdateBookingStatus={handleUpdateBookingStatus}
          onDeleteBooking={handleDeleteBooking}
        />
      )}

      {currentTab === "matrix" && (
        <ScheduleMatrix
          courts={courts}
          bookings={bookings}
          onOpenBookingForSlot={(courtId, date, time) =>
            handleOpenManualBooking({ courtId, date, time })
          }
        />
      )}

      {currentTab === "pricing" && (
        <PricingSettings
          courts={courts}
          onBulkUpdatePricing={handleBulkUpdatePricing}
        />
      )}

      {currentTab === "customers" && (
        <CustomerDirectory
          bookings={bookings}
          courts={courts}
          onOpenBookingForCustomer={(customerName, customerMobile) =>
            handleOpenManualBooking({ customerName, customerMobile })
          }
        />
      )}

      {currentTab === "analytics" && (
        <AnalyticsView stats={stats} bookings={bookings} courts={courts} />
      )}

      {currentTab === "settings" && <SettingsView />}

      {/* Modals */}
      <CourtModal
        isOpen={isCourtModalOpen}
        onClose={() => setIsCourtModalOpen(false)}
        onSave={handleSaveCourt}
        initialData={editingCourt}
        totalCourtsCount={courts.length}
      />

      <ManualBookingModal
        isOpen={isManualBookingOpen}
        onClose={() => setIsManualBookingOpen(false)}
        courts={courts}
        onBookingCreated={fetchData}
        initialCourtId={manualBookingPreset.courtId}
        initialDate={manualBookingPreset.date}
        initialTime={manualBookingPreset.time}
      />
    </AdminLayout>
  );
};

export default AdminDashboard;
