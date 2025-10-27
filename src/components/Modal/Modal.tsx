import "./Modal.scss"
import { useState, useEffect } from "react"
import type { CandidateForm, Candidate } from "../../types/Candidate"

export type { CandidateForm };

const CANDIDATE_STATUSES = ['Normal', 'Favorit', 'Eliminiert'];

// props akzeptieren den zu bearbeitenden Kandidaten
export function ModalCandidates({ candidateToEdit, onSave, onClose, onDelete, apprenticeships = [] }: { candidateToEdit?: Candidate | null, onSave: (candidate: CandidateForm) => void, onClose: () => void, onDelete?: (id: number) => void, apprenticeships?: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Lokaler State für das Formular (snake_case intern, um mit Backend kompatibel zu sein)
  const [first_name, setFirstName] = useState("")
  const [last_name, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [apprenticeship_id, setApprenticeshipId] = useState<number | undefined>(undefined)
  const [status, setStatus] = useState<CandidateForm['status']>("Normal")

  // Setze den State, wenn ein Kandidat zum Bearbeiten übergeben wird
  useEffect(() => {
    if (candidateToEdit) {
      setFirstName(candidateToEdit.first_name || "");
      setLastName(candidateToEdit.last_name || "");
      setEmail(candidateToEdit.email || "");
      setApprenticeshipId(candidateToEdit.apprenticeship_id || undefined);
      setStatus(candidateToEdit.status || "Normal");
      setIsOpen(true); 
    }
  }, [candidateToEdit]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setApprenticeshipId(undefined);
    setStatus("Normal");
    setError("");
  }

  const handleSave = async () => {
    setError("");
    
    if (!email || !first_name) {
      setError("E-Mail und Vorname sind erforderlich");
      return;
    }

    setLoading(true);

    try {
      const candidate: CandidateForm = {
        first_name,
        last_name,
        email,
        apprenticeship_id,
        status,
      }
      await onSave(candidate)
      handleClose();
    } catch (err: any) {
      setError(err.message || "Fehler beim Speichern");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
    onClose();
  }

  const handleDelete = () => {
    if (candidateToEdit && onDelete && window.confirm("Sind Sie sicher, dass Sie diesen Kandidaten löschen möchten?")) {
      onDelete(candidateToEdit.id);
      handleClose();
    }
  }

  const handleOpen = () => {
    resetForm();
    setIsOpen(true);
  }

  return (
    <>
      {!candidateToEdit && (
        <button className="modal-trigger" onClick={handleOpen}>
          Kandidat erstellen
        </button>
      )}


      {isOpen && (
        <>
          <div className="modal-overlay" onClick={handleClose} />
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-header">
              <h2>{candidateToEdit ? "Kandidat bearbeiten" : "Kandidat erstellen"}</h2> 
              <button className="modal-close" onClick={handleClose}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="form-group">
                  <label htmlFor="firstName">Vorname</label>
                  <input id="firstName" type="text" placeholder="Max" value={first_name} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Nachname</label>
                  <input id="lastName" type="text" placeholder="Mustermann" value={last_name} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email-Adresse</label>
                  <input id="email" type="email" placeholder="max@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                
                {/* Status-Dropdown aktualisiert */}
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select id="status" value={status} onChange={(e) => setStatus(e.target.value as CandidateForm['status'])}>
                    {CANDIDATE_STATUSES.map(s => (
                      <option key={s} value={s}>{s === 'Favorit' ? '⭐ Favorit' : s === 'Normal' ? '◯ Normal' : '✕ Unpopulär'}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="jobBranche">Lehrberuf</label>
                  {apprenticeships.length > 0 ? (
                    <select 
                      id="jobBranche" 
                      value={apprenticeship_id || ''} 
                      onChange={(e) => setApprenticeshipId(e.target.value ? parseInt(e.target.value) : undefined)}
                    >
                      <option value="">-- Wählen Sie einen Lehrberuf --</option>
                      {apprenticeships.map((app: any) => (
                        <option key={app.id} value={app.id}>{app.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      id="jobBranche" 
                      type="number" 
                      placeholder="z.B. 1" 
                      value={apprenticeship_id || ''} 
                      onChange={(e) => setApprenticeshipId(e.target.value ? parseInt(e.target.value) : undefined)} 
                    />
                  )}
                </div>

                {error && <div className="error-message">{error}</div>}
              </form>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleClose}>Abbrechen</button>
              {candidateToEdit && onDelete && (
                <button className="btn btn-danger" onClick={handleDelete}>Löschen</button>
              )}
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? "Speichert..." : (candidateToEdit ? "Aktualisieren" : "Erstellen")}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ModalCandidates;