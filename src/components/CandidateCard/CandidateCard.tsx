import "./CandidateCard.scss";
import star from "~/assets/star.svg";
import { useState, useEffect } from "react";
import type { CandidateCardProps } from "../../types/Candidate";

const CandidateCard = ({ candidate, isAdmin, onEdit, onView }: CandidateCardProps) => {
  const isFavorite = candidate.status === 'Favorit';
  const [apprenticeshipName, setApprenticeshipName] = useState<string[]>(["Laden..."]);

  // Lade Lehrstelle Name beim Mount / wenn sich apprenticeships ändern
  useEffect(() => {
    if (candidate.apprenticeships && candidate.apprenticeships.length > 0) {
      // Zeige die erste Lehrstelle (oder passe an, falls mehrere angezeigt werden sollen)
      setApprenticeshipName(candidate.apprenticeships.map(app => app.name));
    } else {
      setApprenticeshipName(["Nicht zugeordnet"]);
    }
  }, [candidate.apprenticeships]);
  
  return (
    <div className="talent-card">
      <div className="card-header">
        <div className="name">
          {candidate.firstName} {candidate.lastName}
        </div>
        {isFavorite && <img src={star} alt="talent star" />}
      </div>
      
      <div className="card-body">
  <p><strong>Email:</strong> {candidate.email}</p>
  <p><strong>Status:</strong> {candidate.status}</p>
  <p><strong>Interessiert:</strong> {apprenticeshipName.join(", ")}</p>
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