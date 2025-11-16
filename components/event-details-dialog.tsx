"use client";

import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  Users,
  MapPin,
  Calendar,
  UserCircle,
} from "lucide-react";
import { useEventBookings } from "@/hooks/use-event-bookings";
import type { Event, EventBookingStatus, PaymentStatus } from "@/types/event";
import {
  EventBookingStatus as BookingStatusEnum,
  PaymentStatus as PaymentStatusEnum,
} from "@/types/event";

interface EventDetailsDialogProps {
  open: boolean;
  event: Event | null;
  onOpenChange: (open: boolean) => void;
}

const bookingStatusBadge: Record<
  EventBookingStatus,
  { bg: string; text: string }
> = {
  CONFIRMED: { bg: "bg-green-100", text: "text-green-800" },
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-800" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-800" },
  NO_SHOW: { bg: "bg-gray-100", text: "text-gray-800" },
};

const paymentStatusBadge: Record<PaymentStatus, { bg: string; text: string }> =
  {
    PAID: { bg: "bg-green-100", text: "text-green-800" },
    UNPAID: { bg: "bg-red-100", text: "text-red-800" },
    REFUNDED: { bg: "bg-blue-100", text: "text-blue-800" },
  };

export function EventDetailsDialog({
  open,
  event,
  onOpenChange,
}: EventDetailsDialogProps) {
  const {
    bookingsData,
    loading,
    error,
    updatingBookingId,
    updateBookingStatus,
  } = useEventBookings({
    eventId: event?.id,
    autoFetch: open && !!event,
  });

  if (!event) return null;

  const eventDate = new Date(event.startTime);
  const eventEndDate = new Date(event.endTime);
  const capacityPercentage = (event.attendeeCount / event.capacity) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.title}</DialogTitle>
          <DialogDescription className="text-base mt-2">
            View event details and manage attendees
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-semibold">
                    {format(eventDate, "MMMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(eventDate, "HH:mm")} -{" "}
                    {format(eventEndDate, "HH:mm")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{event.location}</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Capacity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="font-semibold">
                      {event.attendeeCount} / {event.capacity} attendees
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(capacityPercentage, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {Math.round(capacityPercentage)}% capacity
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                {event.isPaid ? (
                  <div className="space-y-1">
                    <Badge className="bg-green-100 text-green-800">
                      Paid Event
                    </Badge>
                    <p className="font-semibold text-lg mt-2">
                      ${event.price.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <Badge variant="outline">Free Event</Badge>
                )}
              </CardContent>
            </Card>

            {event.tags.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Bookings Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Attendees ({bookingsData?.totalAttendees || 0})
            </h3>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error loading attendees</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading && !bookingsData ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-red-600 mr-2" />
                <span className="text-gray-600">Loading attendees...</span>
              </div>
            ) : bookingsData?.bookings && bookingsData.bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Booking Status</TableHead>
                      {event.isPaid && <TableHead>Payment Status</TableHead>}
                      <TableHead>Booked At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookingsData.bookings.map((booking) => {
                      const bookingBadge = bookingStatusBadge[booking.status];
                      const paymentBadge =
                        paymentStatusBadge[booking.paymentStatus];
                      const isUpdating =
                        updatingBookingId === booking.bookingId;

                      return (
                        <TableRow key={booking.bookingId}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {booking.user.avatarUrl ? (
                                <img
                                  src={booking.user.avatarUrl}
                                  alt={booking.user.name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <UserCircle className="w-8 h-8 text-gray-300" />
                              )}
                              {booking.user.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {booking.user.email}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={booking.status}
                              onValueChange={(newStatus) =>
                                updateBookingStatus(booking.bookingId, {
                                  status: newStatus,
                                })
                              }
                              disabled={isUpdating}
                            >
                              <SelectTrigger
                                className={`w-[140px] font-medium ${
                                  bookingStatusBadge[booking.status].bg
                                } ${bookingStatusBadge[booking.status].text}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={BookingStatusEnum.CONFIRMED}>
                                  Confirmed
                                </SelectItem>
                                <SelectItem value={BookingStatusEnum.PENDING}>
                                  Pending
                                </SelectItem>
                                <SelectItem value={BookingStatusEnum.CANCELLED}>
                                  Cancelled
                                </SelectItem>
                                <SelectItem value={BookingStatusEnum.NO_SHOW}>
                                  No Show
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          {event.isPaid && (
                            <TableCell>
                              <Select
                                value={booking.paymentStatus}
                                onValueChange={(newPaymentStatus) =>
                                  updateBookingStatus(booking.bookingId, {
                                    paymentStatus: newPaymentStatus,
                                  })
                                }
                                disabled={isUpdating}
                              >
                                <SelectTrigger
                                  className={`w-[120px] font-medium ${
                                    booking.paymentStatus === "PAID"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : booking.paymentStatus === "UNPAID"
                                      ? "bg-red-100 text-red-800 border-red-200"
                                      : "bg-blue-100 text-blue-800 border-blue-200"
                                  }`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={PaymentStatusEnum.PAID}>
                                    Paid
                                  </SelectItem>
                                  <SelectItem value={PaymentStatusEnum.UNPAID}>
                                    Unpaid
                                  </SelectItem>
                                  <SelectItem
                                    value={PaymentStatusEnum.REFUNDED}
                                  >
                                    Refunded
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          )}
                          <TableCell className="text-sm text-gray-600">
                            {format(
                              new Date(booking.bookedAt),
                              "MMM dd, HH:mm"
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No attendees for this event yet</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
