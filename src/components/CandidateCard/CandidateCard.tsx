import "./CandidateCard.scss";
import star from "~/assets/star.svg";
import { useState, useEffect } from "react";
import type { CandidateCardProps } from "../../types/Candidate";

const CandidateCard = ({ candidate, isAdmin, onEdit, onView }: CandidateCardProps) => {
  const isFavorite = candidate.status === 'Favorit';
  const [apprenticeshipName, setApprenticeshipName] = useState<string>("Laden...");

  // Lade Lehrstelle Name beim Mount
  useEffect(() => {
    if (candidate.apprenticeship) {
      setApprenticeshipName(candidate.apprenticeship);
    } else {
      setApprenticeshipName("Nicht zugeordnet");
    }
  }, [candidate.apprenticeship]);
  
  return (
    <div className="talent-card">
      <div className="card-header">
        <div className="name">
          {candidate.first_name} {candidate.last_name}
        </div>
        {isFavorite && <img src={star} alt="talent star" />}
      </div>
      
      <div className="card-body">
        <p><strong>Email:</strong> {candidate.email}</p>
        <p><strong>Status:</strong> {candidate.status}</p>
        <p><strong>Lehrstelle:</strong> {apprenticeshipName}</p>
      </div>

      <div className="card-actions">
        <button className="btn-view" onClick={() => onView(candidate)}>Ansehen</button>
        {isAdmin && (
          <button className="btn-edit" onClick={() => onEdit(candidate)}>Bearbeiten</button>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;