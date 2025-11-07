"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  MapPin,
  Users,
  Trash2,
  Pencil,
  RefreshCw,
  Plus,
  Loader2,
  Eye,
  AlertCircle,
  Search,
  Filter,
  Clock,
  DollarSign,
  Tag,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useEvents } from "@/hooks/use-events";
import { EventDetailsDialog } from "@/components/event-details-dialog";
import type {
  Event,
  CreateEventData,
  UpdateEventData,
  EventStatus,
} from "@/types/event";
import { EventStatus as EventStatusEnum } from "@/types/event";

const statusBadgeVariants: Record<
  EventStatus,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  UPCOMING: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    icon: <Clock className="w-3 h-3" />,
  },
  ONGOING: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  COMPLETED: {
    bg: "bg-green-100",
    text: "text-green-800",
    icon: <CheckCircle className="w-3 h-3" />,
  },
  CANCELLED: {
    bg: "bg-red-100",
    text: "text-red-800",
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

interface EventFormState {
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  startTime: string;
  endTime: string;
  capacity: string;
  tags: string;
  isPaid: boolean;
  price: string;
}

const emptyForm: EventFormState = {
  title: "",
  description: "",
  location: "",
  imageUrl: "",
  startTime: "",
  endTime: "",
  capacity: "",
  tags: "",
  isPaid: false,
  price: "",
};

export default function EventsPage() {
  const {
    events,
    eventsByStatus,
    loading,
    error,
    creating,
    updatingId,
    deletingId,
    refetch,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEvents();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState<EventFormState>(emptyForm);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<EventStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] =
    useState<Event | null>(null);

  const isProcessing = creating || Boolean(updatingId);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [events, statusFilter, searchTerm]);

  const eventsWithMeta = useMemo(
    () =>
      filteredEvents.map((event) => ({
        ...event,
        formattedStartTime: format(new Date(event.startTime), "MMM dd, HH:mm"),
        formattedEndTime: format(new Date(event.endTime), "HH:mm"),
        updatedAgo: formatDistanceToNow(new Date(event.updatedAt), {
          addSuffix: true,
        }),
      })),
    [filteredEvents]
  );

  const stats = useMemo(
    () => ({
      total: events.length,
      upcoming: eventsByStatus.get(EventStatusEnum.UPCOMING)?.length || 0,
      ongoing: eventsByStatus.get(EventStatusEnum.ONGOING)?.length || 0,
      completed: eventsByStatus.get(EventStatusEnum.COMPLETED)?.length || 0,
      totalAttendees: events.reduce(
        (sum, event) => sum + event.attendeeCount,
        0
      ),
    }),
    [events, eventsByStatus]
  );

  const handleCreate = () => {
    setFormMode("create");
    setActiveEvent(null);
    setFormData(emptyForm);
    setFormError(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (event: Event) => {
    setFormMode("edit");
    setActiveEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      imageUrl: event.imageUrl || "",
      startTime: new Date(event.startTime).toISOString().slice(0, 16),
      endTime: new Date(event.endTime).toISOString().slice(0, 16),
      capacity: event.capacity.toString(),
      tags: event.tags.join(", "),
      isPaid: event.isPaid,
      price: event.price.toString(),
    });
    setFormError(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setActiveEvent(null);
    setFormData(emptyForm);
    setFormError(null);
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEventForDetails(event);
    setDetailsDialogOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError("Event title is required");
      return;
    }

    if (!formData.description.trim()) {
      setFormError("Description is required");
      return;
    }

    if (!formData.location.trim()) {
      setFormError("Location is required");
      return;
    }

    if (!formData.startTime) {
      setFormError("Start time is required");
      return;
    }

    if (!formData.endTime) {
      setFormError("End time is required");
      return;
    }

    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      setFormError("Capacity must be greater than 0");
      return;
    }

    if (
      formData.isPaid &&
      (!formData.price || parseFloat(formData.price) < 0)
    ) {
      setFormError("Price must be provided and non-negative for paid events");
      return;
    }

    try {
      const payload: CreateEventData | UpdateEventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        imageUrl: formData.imageUrl.trim() || null,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        capacity: parseInt(formData.capacity),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        isPaid: formData.isPaid,
        price: formData.isPaid ? parseFloat(formData.price) : 0,
      };

      if (formMode === "create") {
        // @ts-ignore
        await createEvent(payload);
      } else if (activeEvent) {
        await updateEvent(activeEvent.id, payload);
      }

      closeDialog();
    } catch (submissionError) {
      if (submissionError instanceof Error) {
        setFormError(submissionError.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <span className="ml-2 text-lg text-gray-600">Loading events...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="border border-red-100 bg-gradient-to-r from-red-50 via-rose-50 to-orange-50">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <Badge className="w-fit bg-red-100 text-red-700 border-red-200">
              Events Hub
            </Badge>
            <div>
              <CardTitle className="text-3xl font-semibold text-red-700">
                Manage Events & Experiences
              </CardTitle>
              <CardDescription className="text-base text-red-600/80">
                Create, organize, and track all your destination events and
                activities.
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={refetch}
              disabled={loading}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </div>
        </CardHeader>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Unable to load events</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <Button size="sm" variant="secondary" onClick={refetch}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-gray-900">
            {stats.total}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">Upcoming</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-gray-900">
            {stats.upcoming}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">Ongoing</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-gray-900">
            {stats.ongoing}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">Completed</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-gray-900">
            {stats.completed}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500">
              Total Attendees
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-gray-900">
            {stats.totalAttendees}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-red-600" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as EventStatus | "all")
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Events Overview</CardTitle>
          <CardDescription>
            Manage your events, track attendees, and update event details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600">
              <Info className="mb-3 h-10 w-10 text-gray-400" />
              <p className="text-lg font-medium">No events yet</p>
              <p className="mb-6 text-sm text-gray-500">
                Start by creating your first event to engage your audience.
              </p>
              <Button
                onClick={handleCreate}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>
          ) : eventsWithMeta.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No events match your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Capacity / Attendees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventsWithMeta.map((event) => {
                    const statusVariant = statusBadgeVariants[event.status];
                    return (
                      <TableRow key={event.id}>
                        <TableCell className="font-semibold text-gray-900 max-w-xs">
                          {event.title}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-xs">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {event.location}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {event.formattedStartTime}
                            </div>
                            <div className="text-xs text-gray-500">
                              ends {event.formattedEndTime}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            {event.attendeeCount} / {event.capacity}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${statusVariant.bg} ${statusVariant.text}`}
                          >
                            <span className="mr-1">{statusVariant.icon}</span>
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {event.isPaid ? (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              {event.price}
                            </div>
                          ) : (
                            <Badge variant="outline">Free</Badge>
                          )}
                        </TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(event)}
                            title="View event details and attendees"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(event)}
                            disabled={
                              Boolean(updatingId) || deletingId === event.id
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700"
                                disabled={
                                  deletingId === event.id || Boolean(updatingId)
                                }
                              >
                                {deletingId === event.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete event
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove{" "}
                                  <strong>{event.title}</strong>. This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  disabled={deletingId === event.id}
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={deletingId === event.id}
                                  onClick={async () => {
                                    await deleteEvent(event.id);
                                  }}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (open) {
            setIsDialogOpen(true);
          } else {
            closeDialog();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formMode === "create"
                ? "Create event"
                : `Edit ${activeEvent?.title}`}
            </DialogTitle>
            <DialogDescription>
              Set up the event details, schedule, capacity, and pricing.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g. City Walking Tour"
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the event experience..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Event location"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Date & Time</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Date & Time</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      capacity: e.target.value,
                    }))
                  }
                  placeholder="Max attendees"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="e.g. Tourism, Culture, Adventure"
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPaid"
                    checked={formData.isPaid}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isPaid: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <Label htmlFor="isPaid" className="mb-0 cursor-pointer">
                    Paid Event
                  </Label>
                </div>
              </div>

              {formData.isPaid && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                    required={formData.isPaid}
                  />
                </div>
              )}
            </div>

            {formError && (
              <Alert variant="destructive">
                <AlertTitle>Submission error</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="bg-red-600 hover:bg-red-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : formMode === "create" ? (
                  "Create Event"
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <EventDetailsDialog
        open={detailsDialogOpen}
        event={selectedEventForDetails}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  );
}
