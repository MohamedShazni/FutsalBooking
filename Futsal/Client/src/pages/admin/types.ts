export interface Court {
  _id?: string;
  courtId: number;
  name: string;
  type: string;
  surface: string;
  basePrice: number;
  peakPrice: number;
  status: "Active" | "Maintenance" | "Inactive";
  capacity: string;
  features: string[];
  description: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  _id?: string;
  bookingId: string;
  customerName: string;
  customerMobile: string;
  courtId: number;
  courtName: string;
  date: string;
  time: string;
  price: number;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentStatus: "Paid" | "Pending" | "Pay at Venue";
  createdAt?: string;
}

export interface AdminStats {
  summary: {
    totalBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    completedBookings: number;
    totalRevenue: number;
    paidRevenue: number;
    pendingRevenue: number;
    todayBookingsCount: number;
    todayRevenue: number;
    totalCourts: number;
    activeCourts: number;
    maintenanceCourts: number;
  };
  courtUsage: {
    courtId: number;
    name: string;
    type: string;
    status: string;
    bookingsCount: number;
    revenue: number;
  }[];
  recentBookings: Booking[];
  todayBookings: Booking[];
  courts: Court[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: "booking" | "court" | "system";
  data?: any;
}
