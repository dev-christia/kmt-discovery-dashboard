"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { eventApi } from "@/lib/api-event";
import { useToast } from "@/hooks/use-toast";
import type {
  Event,
  CreateEventData,
  UpdateEventData,
  EventStatus,
} from "@/types/event";

interface UseEventsOptions {
  autoFetch?: boolean;
}

export function useEvents({ autoFetch = true }: UseEventsOptions = {}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: session } = useSession();
  const { toast } = useToast();

  const accessToken = useMemo(() => {
    const sessionWithToken = session as any;
    return sessionWithToken?.accessToken as string | undefined;
  }, [session]);

  const withAuthGuard = useCallback(
    async <T,>(handler: () => Promise<T>): Promise<T> => {
      if (!accessToken) {
        const message = "Authentication required";
        setError(message);
        toast({
          variant: "destructive",
          title: "Unauthorized",
          description: message,
        });
        throw new Error(message);
      }

      return handler();
    },
    [accessToken, toast],
  );

  const fetchEvents = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await eventApi.list(accessToken);
      setEvents(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch events";
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, [accessToken, toast]);

  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [autoFetch, fetchEvents]);

  const refetch = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = useCallback(
    async (payload: CreateEventData) =>
      withAuthGuard(async () => {
        try {
          setCreating(true);
          const event = await eventApi.create(payload, accessToken);
          setEvents((prev) => [event, ...prev]);
          toast({
            title: "Event Created",
            description: `${event.title} has been created successfully`,
          });
          return event;
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to create event";
          setError(message);
          toast({
            variant: "destructive",
            title: "Error",
            description: message,
          });
          throw err;
        } finally {
          setCreating(false);
        }
      }),
    [accessToken, toast, withAuthGuard],
  );

  const updateEvent = useCallback(
    async (eventId: string, payload: UpdateEventData) =>
      withAuthGuard(async () => {
        try {
          setUpdatingId(eventId);
          const event = await eventApi.update(eventId, payload, accessToken);
          setEvents((prev) => prev.map((item) => (item.id === event.id ? event : item)));
          toast({
            title: "Event Updated",
            description: `${event.title} has been updated`,
          });
          return event;
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to update event";
          setError(message);
          toast({
            variant: "destructive",
            title: "Error",
            description: message,
          });
          throw err;
        } finally {
          setUpdatingId(null);
        }
      }),
    [accessToken, toast, withAuthGuard],
  );

  const deleteEvent = useCallback(
    async (eventId: string) =>
      withAuthGuard(async () => {
        try {
          setDeletingId(eventId);
          await eventApi.delete(eventId, accessToken);
          setEvents((prev) => prev.filter((item) => item.id !== eventId));
          toast({
            title: "Event Deleted",
            description: "Event has been removed successfully",
          });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to delete event";
          setError(message);
          toast({
            variant: "destructive",
            title: "Error",
            description: message,
          });
          throw err;
        } finally {
          setDeletingId(null);
        }
      }),
    [accessToken, toast, withAuthGuard],
  );

  const getEventById = useCallback(
    async (eventId: string) =>
      withAuthGuard(async () => {
        try {
          return await eventApi.getById(eventId, accessToken);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch event";
          setError(message);
          toast({
            variant: "destructive",
            title: "Error",
            description: message,
          });
          throw err;
        }
      }),
    [accessToken, toast, withAuthGuard],
  );

  const eventsByStatus = useMemo(() => {
    const grouped = new Map<EventStatus, Event[]>();
    events.forEach((event) => {
      if (!grouped.has(event.status)) {
        grouped.set(event.status, []);
      }
      grouped.get(event.status)!.push(event);
    });
    return grouped;
  }, [events]);

  return {
    events,
    eventsByStatus,
    loading,
    creating,
    updatingId,
    deletingId,
    error,
    refetch,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
  };
}
