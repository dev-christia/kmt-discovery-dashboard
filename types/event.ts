export enum EventStatus {
  UPCOMING = "UPCOMING",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum EventBookingStatus {
  CONFIRMED = "CONFIRMED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  REFUNDED = "REFUNDED",
}

export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
}

export interface EventBooking {
  bookingId: string;
  eventId: string;
  userId: string;
  bookingAt: string;
  status: EventBookingStatus;
  paymentStatus: PaymentStatus;
}

export interface EventBookingWithUser {
  bookingId: string;
  status: EventBookingStatus;
  paymentStatus: PaymentStatus;
  bookedAt: string;
  user: User;
}

export interface EventBookingsResponse {
  message: string;
  status: string;
  eventId: string;
  eventTitle: string;
  totalBookings: number;
  totalAttendees: number;
  bookings: EventBookingWithUser[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl?: string | null;
  startTime: string;
  endTime: string;
  capacity: number;
  attendeeCount: number;
  tags: string[];
  status: EventStatus;
  isPaid: boolean;
  price: number;
  EventBooking: EventBooking[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  location: string;
  imageUrl?: string | null;
  startTime: string;
  endTime: string;
  capacity: number;
  tags?: string[];
  isPaid?: boolean;
  price?: number;
}

export interface UpdateEventData extends Partial<CreateEventData> {}

export interface EventsResponse {
  message: string;
  status: string;
  events: Event[];
}
