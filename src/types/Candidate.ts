/**
 * Candidate Types
 * Zentrale Definition für Kandidaten-Datenstrukturen
 */

export interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: 'Favorit' | 'Normal' | 'Eliminiert';
  apprenticeship?: string;
  apprenticeship_id?: number;
  createdAt?: string;
}

export type CandidateForm = {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  status?: 'Favorit' | 'Normal' | 'Eliminiert';
  apprenticeship_id?: number;
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
