/**
 * Event Types
 * Zentrale Definition für Event-Datenstrukturen
 */

export interface Event {
  id: number;
  title: string;
  description: string;
  startingAt: string;
  duration?: string;
  invitationsSendingAt?: string;
  registrationsClosingAt?: string;
  registrationRequired?: boolean;
  invitationsSent?: boolean;
  createdAt: string;
  createdByAccountId: number;  
  createdByFirstName: string;
  createdByLastName: string;
  registrationsCount?: number;
}

export type EventForm = {
  title?: string;
  description?: string;
  startingAt?: string;
  duration?: string;
  invitationsSendingAt?: string;
  registrationsClosingAt?: string;
};

export interface EventCardProps {
  event: Event;
  onEdit: (formData: Event) => void;
  onView: (event: Event) => void;
  registrationCount?: number;
}

export interface EventListProps {
  refreshKey: number;
}
