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
        title: "Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, [eventId, accessToken, toast]);

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
    refetch,
  };
}
