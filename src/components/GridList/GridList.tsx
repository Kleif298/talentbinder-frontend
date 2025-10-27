import { useState, useEffect } from "react";
import CandidateCard from "../CandidateCard/CandidateCard";
import "./GridList.scss";
import { getAdminStatus } from "../../utils/auth";
import { candidatesAPI } from "../../api/candidatesAPI";
import type { Candidate, GridListProps } from "../../types/Candidate";

const GridList = ({ refreshKey, filterParams, onEditCandidate, onViewCandidate }: GridListProps) => {

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = getAdminStatus(); 

  async function fetchCandidatesData(): Promise<Candidate[]> {
    const { search, status, sortBy } = filterParams;
    return await candidatesAPI.getAll(search || undefined, status || undefined, sortBy || undefined);
  }

  // Lade Kandidaten bei Erst-Render oder wenn sich refreshKey/filterParams ändert
  useEffect (() => {
    async function loadCandidates() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchCandidatesData();
        setCandidates(data);
      } catch (err: any) {
        setError("Fehler beim Laden der Kandidatendaten: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
      loadCandidates();
  }, [refreshKey, filterParams]);

  if (isLoading) {
    return <div className="grid-list-container">Lade Kandidaten...</div>;
  }

  if (error) {
    return <div className="grid-list-container" style={{ color: "red" }}>Fehler: {error}</div>;
  }

  if (candidates.length === 0) {
    return <div className="grid-list-container no-candidates">Keine Kandidaten gefunden.</div>;
  }
  
  return (
    <div className="grid-list-container">
      {candidates.map((candidate) => (
        <CandidateCard 
          key={candidate.id} 
          candidate={candidate} 
          isAdmin={isAdmin}
          onEdit={onEditCandidate}
          onView={onViewCandidate}
        />
      ))}
    </div>
  );
};

export default GridList;