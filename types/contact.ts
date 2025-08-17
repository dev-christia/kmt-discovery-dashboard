export enum ContactStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  topic: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContactsResponse {
  contacts: Contact[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalContacts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ContactStats {
  total: number;
  unread: number;
  read: number;
  inProgress: number;
  resolved: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
}

export interface CreateContactData {
  name: string;
  email: string;
  topic: string;
  subject: string;
  message: string;
}
