import { useState, useEffect } from "react";
import "~/components/EventCard/EventCard.scss";
import type { EventCardProps } from "../../types/Event";
import { FaRegCalendarAlt, FaRegClock, FaUserCheck, FaCalendarCheck, FaUserPlus } from 'react-icons/fa';
import { getAdminStatus, getAccountId, isOwnerOfEvent } from "~/utils/auth";
import { candidatesAPI } from "~/api/candidatesAPI";
import { recruitersAPI } from "~/api/recruitersAPI";

interface Candidate {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

interface RegisteredCandidate {
    candidateId: number;
    firstName: string;
    lastName: string;
    email: string;
}

const EventCard = ({ event, onEdit, onView, registrationCount = 0, onRefresh }: EventCardProps) => {
    const isAdmin = getAdminStatus();
    const currentUserId = getAccountId();
    const canEdit = isAdmin || event.createdByAccountId === currentUserId;
    const isOwner = isOwnerOfEvent(event.createdByAccountId);
    
    const [showAddCandidate, setShowAddCandidate] = useState(false);
    const [showRegisteredCandidates, setShowRegisteredCandidates] = useState(false);
    const [availableCandidates, setAvailableCandidates] = useState<Candidate[]>([]);
    const [registeredCandidates, setRegisteredCandidates] = useState<RegisteredCandidate[]>([]);
    const [loading, setLoading] = useState(false);

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            time: date.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const startDateTime = formatDateTime(event.startingAt);
    const isUpcoming = new Date(event.startingAt) > new Date();

    // Lade registrierte Kandidaten wenn Owner
    useEffect(() => {
        if (isOwner && event.id) {
            loadRegisteredCandidates();
        }
    }, [event.id, isOwner]);

    const loadRegisteredCandidates = async () => {
        try {
            const registrations = await recruitersAPI.getEventRegistrations(event.id);
            console.log('Event ID:', event.id);
            console.log('Raw registrations:', registrations);
            console.log('Registrations array:', registrations.registrations);
            
            const registered = registrations.registrations.map((r: any) => {
                console.log('Processing registration:', r);
                return {
                    candidateId: r.candidateId,
                    firstName: r.firstName,
                    lastName: r.lastName,
                    email: r.email
                };
            });
            console.log('Processed registered candidates:', registered);
            setRegisteredCandidates(registered);
        } catch (err) {
            console.error('Fehler beim Laden der Registrierungen:', err);
        }
    };

    const loadAvailableCandidates = async () => {
        setLoading(true);
        try {
            const allCandidates = await candidatesAPI.getAll();
            const registeredIds = registeredCandidates.map(r => r.candidateId);
            const available = allCandidates.filter(c => !registeredIds.includes(c.id));
            setAvailableCandidates(available);
        } catch (err) {
            console.error('Fehler beim Laden der Kandidaten:', err);
            setAvailableCandidates([]);
        } finally {
            setLoading(false);
        }
    };

    const handleShowAddCandidate = () => {
        loadAvailableCandidates();
        setShowAddCandidate(true);
    };

    const handleAddCandidate = async (candidateId: number) => {
        try {
            await recruitersAPI.addCandidateToEvent(event.id, candidateId);
            await loadRegisteredCandidates();
            setShowAddCandidate(false);
            // Trigger refresh in parent component
            if (onRefresh) {
                onRefresh();
            }
        } catch (err: any) {
            alert(`Fehler: ${err.message}`);
        }
    };

    const handleCancelAddCandidate = () => {
        setShowAddCandidate(false);
        setAvailableCandidates([]);
    };

    return (
        <div className="event-card">
            <div className="event-card-content">
                <div className="event-card-header">
                    <div className="event-title-section">
                        <h3 className="event-title">{event.title}</h3>
                        {isUpcoming && <span className="event-badge upcoming">Bevorstehend</span>}
                    </div>
                    <div className="header-buttons">
                        {canEdit && (
                            <button 
                                className="edit-button-icon" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(event);
                                }}
                                aria-label="Bearbeiten"
                            >
                                ✏️
                            </button>
                        )}
                        <button 
                            className="info-button-icon" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onView(event);
                            }}
                            aria-label="Details anzeigen"
                        >
                                i
                        </button>
                    </div>
                </div>
                
                <p className="event-description">{event.description}</p>
                
                <div className="event-meta">
                    <div className="meta-item primary">
                        <FaRegCalendarAlt className="meta-icon" />
                        <div className="meta-content">
                            <span className="meta-label">Datum & Zeit</span>
                            <span className="meta-value">{startDateTime.date} • {startDateTime.time}</span>
                        </div>
                    </div>
                    
                    {event.duration && (
                        <div className="meta-item">
                            <FaRegClock className="meta-icon" />
                            <div className="meta-content">
                                <span className="meta-label">Dauer</span>
                                <span className="meta-value">{String(event.duration)}</span>
                            </div>
                        </div>
                    )}

                    <div className="meta-item">
                        <FaUserCheck className="meta-icon" />
                        <div className="meta-content">
                            <span className="meta-label">Anmeldungen</span>
                            <span className="meta-value">{registrationCount}</span>
                        </div>
                    </div>

                    {event.registrationsClosingAt && (
                        <div className="meta-item">
                            <FaCalendarCheck className="meta-icon" />
                            <div className="meta-content">
                                <span className="meta-label">Anmeldeschluss</span>
                                <span className="meta-value">
                                    {formatDateTime(event.registrationsClosingAt).date}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="event-footer">
                    <span className="event-creator">
                        {event.createdByFirstName} {event.createdByLastName}
                    </span>
                    <span className="event-date">
                        {new Date(event.createdAt).toLocaleDateString('de-DE')}
                    </span>
                </div>

                {/* Registrierte Kandidaten anzeigen - nur für Owner */}
                {isOwner && registeredCandidates.length > 0 && (
                    <div className="registered-candidates-section">
                        <div className="registered-candidates-header">
                            <h4>Registrierte Kandidaten ({registeredCandidates.length})</h4>
                            <button 
                                className="toggle-candidates-btn" 
                                onClick={() => setShowRegisteredCandidates(!showRegisteredCandidates)}
                            >
                                {showRegisteredCandidates ? '▼' : '▶'}
                            </button>
                        </div>
                        {showRegisteredCandidates && (
                            <div className="registered-candidates-list">
                                {registeredCandidates.map((candidate) => (
                                    <div key={candidate.candidateId} className="registered-candidate-item">
                                        {candidate.firstName} {candidate.lastName}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Kandidaten hinzufügen Section - nur für Owner */}
                {isOwner && !showAddCandidate && (
                    <div className="add-candidate-footer">
                        <button 
                            className="btn-add-candidate-card" 
                            onClick={handleShowAddCandidate}
                        >
                            <FaUserPlus /> Kandidat hinzufügen
                        </button>
                    </div>
                )}

                {/* Kandidaten-Auswahl Dropdown */}
                {isOwner && showAddCandidate && (
                    <div className="candidate-dropdown">
                        <div className="candidate-dropdown-header">
                            <h4>Kandidat auswählen</h4>
                            <button 
                                className="close-dropdown" 
                                onClick={handleCancelAddCandidate}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="candidate-dropdown-list">
                            {loading ? (
                                <div className="loading-state">Lade Kandidaten...</div>
                            ) : availableCandidates.length > 0 ? (
                                availableCandidates.map((candidate) => (
                                    <div 
                                        key={candidate.id} 
                                        className="candidate-dropdown-item"
                                        onClick={() => handleAddCandidate(candidate.id)}
                                    >
                                        <span className="candidate-name">
                                            {candidate.firstName} {candidate.lastName}
                                        </span>
                                        <span className="candidate-email">{candidate.email}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="no-candidates">Alle Kandidaten sind bereits registriert</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventCard;