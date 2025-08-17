import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Contact, ContactsResponse, ContactStats, ContactStatus, CreateContactData } from "@/types/contact";

interface UseContactsProps {
  page?: number;
  limit?: number;
  status?: ContactStatus;
}

export function useContacts({ page = 1, limit = 10, status }: UseContactsProps = {}) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState<ContactsResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchContacts = async () => {
    // @ts-ignore
    if (!session?.accessToken) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (status) {
        params.append('status', status);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts?${params}`, {
        headers: {
            // @ts-ignore   
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch contacts: ${response.statusText}`);
      }

      const data: { data: ContactsResponse } = await response.json();
      setContacts(data.data.contacts);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [session, page, limit, status]);

  const refetch = () => {
    fetchContacts();
  };

  return {
    contacts,
    pagination,
    loading,
    error,
    refetch,
  };
}

export function useContactStats() {
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchStats = async () => {
    // @ts-ignore 
    if (!session?.accessToken) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts/stats`, {
        headers: {
            // @ts-ignore 
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch contact stats: ${response.statusText}`);
      }

      const data: { data: { stats: ContactStats } } = await response.json();
      setStats(data.data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contact stats');
      console.error('Error fetching contact stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [session]);

  const refetch = () => {
    fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refetch,
  };
}

export function useContactActions() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const updateContactStatus = async (contactId: string, status: ContactStatus): Promise<Contact | null> => {
    // @ts-ignore 
    if (!session?.accessToken) {
      throw new Error("Authentication required");
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts/${contactId}/status`, {
        method: 'PATCH',
        headers: {
            // @ts-ignore 
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update contact status: ${response.statusText}`);
      }

      const data: { data: { contact: Contact } } = await response.json();
      return data.data.contact;
    } catch (err) {
      console.error('Error updating contact status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (contactId: string): Promise<boolean> => {
    // @ts-ignore
    if (!session?.accessToken) {
      throw new Error("Authentication required");
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
            // @ts-ignore
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete contact: ${response.statusText}`);
      }

      return true;
    } catch (err) {
      console.error('Error deleting contact:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getContactById = async (contactId: string): Promise<Contact | null> => {
    // @ts-ignore
    if (!session?.accessToken) {
      throw new Error("Authentication required");
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts/${contactId}`, {
        headers: {
            // @ts-ignore
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch contact: ${response.statusText}`);
      }

      const data: { data: { contact: Contact } } = await response.json();
      return data.data.contact;
    } catch (err) {
      console.error('Error fetching contact:', err);
      throw err;
    }
  };

  return {
    updateContactStatus,
    deleteContact,
    getContactById,
    loading,
  };
}
