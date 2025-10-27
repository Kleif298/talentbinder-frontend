import "~/components/EventCard/EventCard.scss";
import type { EventCardProps } from "../../types/Event";
import { FaRegCalendarAlt, FaRegClock, FaUserCheck } from 'react-icons/fa';
import { getAdminStatus, getAccountId } from "~/utils/auth";


const EventCard = ({ event, onEdit, onView, registrationCount = 0 }: EventCardProps) => {
    const isAdmin = getAdminStatus();
    const currentUserId = getAccountId();
    const canEdit = isAdmin || event.createdByAccountId === currentUserId;

    return (
        <div className="event-card">
            <div className="event-card-header">
                <h2>{event.title}</h2>
            </div>
            
            <div className="event-card-body">
                <p className="description">{event.description}</p>
                
                <div className="event-details">
                    <div className="detail-item">
                        <FaRegCalendarAlt />
                        <span>{new Date(event.startingAt).toLocaleString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</span>
                    </div>
                    
                    {event.duration && (
                        <div className="detail-item">
                            <FaRegClock />
                            <span>{String(event.duration)}</span>
                        </div>
                    )}

                    <div className="detail-item">
                        <FaUserCheck />
                        <span>{registrationCount} {registrationCount === 1 ? 'Anmeldung' : 'Anmeldungen'}</span>
                    </div>
                </div>

                <p className="created-date">Erstellt:  {event.createdByFirstName} {event.createdByLastName}, {new Date(event.createdAt).toLocaleDateString('de-DE')}</p>

            </div>
            
            <div className="button-group">
                <button onClick={() => onView(event)} className="view-button">Ansehen</button>
                {canEdit && (
                    <button onClick={() => onEdit(event)} className="edit-button">Bearbeiten</button>
                )}
            </div>
        </div>
    );
}

export default EventCard;