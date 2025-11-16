"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { eventApi } from "@/lib/api-event";
import { useToast } from "@/hooks/use-toast";
import type { EventBookingsResponse } from "@/types/event";

interface UseEventBookingsOptions {
  eventId?: string;
  autoFetch?: boolean;
}

export function useEventBookings({ eventId, autoFetch = true }: UseEventBookingsOptions = {}) {
  const [bookingsData, setBookingsData] = useState<EventBookingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);

  const { data: session } = useSession();
  const { toast } = useToast();

  const accessToken = (session as any)?.accessToken as string | undefined;

  const fetchBookings = useCallback(async () => {
    if (!eventId || !accessToken) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await eventApi.getBookings(eventId, accessToken);
      setBookingsData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch event bookings";
      setError(message);
      toast({
        variant: "destructive",
        title: "✗ Failed to Load Attendees",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, [eventId, accessToken, toast]);

  const updateBookingStatus = useCallback(
    async (bookingId: string, updates: { status?: string; paymentStatus?: string }) => {
      if (!eventId || !accessToken) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Missing authentication or event information. Please try again.",
        });
        return;
      }

      setUpdatingBookingId(bookingId);

      try {
        await eventApi.updateBookingStatus(eventId, bookingId, updates, accessToken);
        
        // Optimistic update
        setBookingsData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            bookings: prev.bookings.map((booking) =>
              booking.bookingId === bookingId
                ? {
                    ...booking,
                    status: updates.status ? (updates.status as any) : booking.status,
                    paymentStatus: updates.paymentStatus
                      ? (updates.paymentStatus as any)
                      : booking.paymentStatus,
                  }
                : booking
            ),
          };
        });

        // Build descriptive success message
        const updateDetails = [];
        if (updates.status) updateDetails.push(`Booking status → ${updates.status}`);
        if (updates.paymentStatus) updateDetails.push(`Payment status → ${updates.paymentStatus}`);

        toast({
          title: "✓ Update Successful",
          description: updateDetails.length > 0 
            ? updateDetails.join(" | ")
            : "Booking updated successfully",
        });

        // Refetch to ensure sync
        await fetchBookings();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update booking status";
        toast({
          variant: "destructive",
          title: "✗ Update Failed",
          description: message,
        });
      } finally {
        setUpdatingBookingId(null);
      }
    },
    [eventId, accessToken, toast, fetchBookings]
  );

  useEffect(() => {
    if (autoFetch && eventId) {
      fetchBookings();
    }
  }, [autoFetch, eventId, fetchBookings]);

  const refetch = useCallback(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookingsData,
    loading,
    error,
    updatingBookingId,
    refetch,
    updateBookingStatus,
  };
}
