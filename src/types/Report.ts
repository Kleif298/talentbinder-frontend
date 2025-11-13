/**
 * Report Types
 * Zentrale Definition für Report-Datenstrukturen
 */

export interface CandidateForReport {
  candidateId: number;
  firstName: string;
  lastName: string;
  email: string;
  status?: 'Favorit' | 'Normal' | 'Eliminiert';
}

export interface EventReport {
  reportId?: number;
  eventId: number;
  eventTitle: string;
  candidateId: number;
  candidateFirstName: string;
  candidateLastName: string;
  candidateEmail: string;
  status: 'Favorit' | 'Normal' | 'Eliminiert';
  comment?: string;
  attendance: 'Angemeldet' | 'Anwesend' | 'Abwesend' | 'Spontan';
  createdAt?: string;
  createdBy?: number;
}

export interface ReportForm {
  candidateId: number;
  status: 'Favorit' | 'Normal' | 'Eliminiert';
  attendance: 'Angemeldet' | 'Anwesend' | 'Abwesend' | 'Spontan';
  comment?: string;
}

export interface EventWithCandidates {
  eventId: number;
  eventTitle: string;
  description?: string;
  startingAt: string;
  registeredCandidates: CandidateForReport[];
}
