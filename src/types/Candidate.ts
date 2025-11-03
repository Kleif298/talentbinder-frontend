/**
 * Candidate Types
 * Zentrale Definition für Kandidaten-Datenstrukturen
 */

export interface Apprenticeship {
  id: number;
  name: string;
}

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: 'Favorit' | 'Normal' | 'Eliminiert';
  apprenticeships: Apprenticeship[]; // Array statt single ID
  createdAt?: string;
}

export type CandidateForm = {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  status?: 'Favorit' | 'Normal' | 'Eliminiert';
  // support multiple apprenticeships on the form
  apprenticeship_id?: number;
  apprenticeship_ids?: number[];
};

export interface CandidateCardProps {
  candidate: Candidate;
  isAdmin: boolean;
  onEdit: (candidate: Candidate) => void;
  onView: (candidate: Candidate) => void;
}

export interface GridListProps {
  refreshKey: number;
  filterParams: {
    search?: string;
    status?: string;
    sortBy?: string;
  };
  onEditCandidate: (candidate: Candidate) => void;
  onViewCandidate: (candidate: Candidate) => void;
}
