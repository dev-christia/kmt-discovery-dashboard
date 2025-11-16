import { Event, CreateEventData, UpdateEventData, EventsResponse, EventBookingsResponse } from "@/types/event";

class EventApi {
  private baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/events`;

  private getHeaders(accessToken?: string, includeJson: boolean = true) {
    const headers: Record<string, string> = {};

    if (includeJson) {
      headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let message = `Request failed: ${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.json();
        if (errorBody?.message) {
          message = errorBody.message;
        }
      } catch (error) {
        // ignore json parse errors
      }
      throw new Error(message);
    }

    try {
      return (await response.json()) as T;
    } catch (error) {
      throw new Error("Unable to parse server response");
    }
  }

  private normalizeEvent(payload: any): Event {
    if (!payload) {
      throw new Error("Event data is empty");
    }

    if (payload.data && !payload.id) {
      return this.normalizeEvent(payload.data);
    }

    return payload as Event;
  }

  private normalizeEventList(payload: any): Event[] {
    if (Array.isArray(payload)) {
      return payload as Event[];
    }

    if (Array.isArray(payload?.events)) {
      return payload.events as Event[];
    }

    if (Array.isArray(payload?.data)) {
      return payload.data as Event[];
    }

    if (Array.isArray(payload?.data?.events)) {
      return payload.data.events as Event[];
    }

    return [];
  }

  async list(accessToken?: string): Promise<Event[]> {
    const response = await fetch(this.baseUrl, {
      headers: this.getHeaders(accessToken),
    });

    const payload = await this.handleResponse<any>(response);
    return this.normalizeEventList(payload);
  }

  async create(data: CreateEventData, accessToken?: string): Promise<Event> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: this.getHeaders(accessToken),
      body: JSON.stringify(data),
    });

    const payload = await this.handleResponse<any>(response);
    return this.normalizeEvent(payload);
  }

  async update(eventId: string, data: UpdateEventData, accessToken?: string): Promise<Event> {
    const response = await fetch(`${this.baseUrl}/${eventId}`, {
      method: "PUT",
      headers: this.getHeaders(accessToken),
      body: JSON.stringify(data),
    });

    const payload = await this.handleResponse<any>(response);
    return this.normalizeEvent(payload);
  }

  async delete(eventId: string, accessToken?: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${eventId}`, {
      method: "DELETE",
      headers: this.getHeaders(accessToken, false),
    });

    await this.handleResponse<any>(response);
  }

  async getById(eventId: string, accessToken?: string): Promise<Event | null> {
    const response = await fetch(`${this.baseUrl}/${eventId}`, {
      headers: this.getHeaders(accessToken),
    });

    if (response.status === 404) {
      return null;
    }

    const payload = await this.handleResponse<any>(response);
    return this.normalizeEvent(payload);
  }

  async getBookings(eventId: string, accessToken?: string): Promise<EventBookingsResponse> {
    const response = await fetch(`${this.baseUrl}/admin/${eventId}/bookings`, {
      headers: this.getHeaders(accessToken),
    });

    const payload = await this.handleResponse<any>(response);
    return payload as EventBookingsResponse;
  }

  async updateBookingStatus(
    eventId: string,
    bookingId: string,
    data: { status?: string; paymentStatus?: string },
    accessToken?: string
  ): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/admin/booking/${bookingId}/update-status`,
      {
        method: "PUT",
        headers: this.getHeaders(accessToken),
        body: JSON.stringify(data),
      }
    );

    await this.handleResponse<any>(response);
  }
}

export const eventApi = new EventApi();
