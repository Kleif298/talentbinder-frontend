import { useEffect, useState } from "react";
import EventCard from "../EventCard/EventCard";
import { eventsAPI } from "../../api/eventsAPI";
import { recruitersAPI } from "../../api/recruitersAPI";
import type { Event } from "../../types/Event";
    
interface EventListProps {
    onEditStart?: (event: Event) => void;
    onViewStart?: (event: Event) => void;
}

interface EventWithRegistrations extends Event {
    registrationCount?: number;
}

const EventList = ({ onEditStart, onViewStart }: EventListProps) => {

    const [events, setEvents] = useState<EventWithRegistrations[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function handleEditEvent(event: Event) {
        if (onEditStart) {
            onEditStart(event);
        }
    }

    async function fetchEventsData(): Promise<EventWithRegistrations[]> {
        try {
            const eventsData = await eventsAPI.getAll();
            
            // Lade Registrierungsanzahl für jedes Event
            const eventsWithRegistrations = await Promise.all(
                eventsData.map(async (event) => {
                    try {
                        const registrations = await recruitersAPI.getEventRegistrations(event.id);
                        return {
                            ...event,
                            registrationCount: registrations.count
                        };
                    } catch (err) {
                        console.error(`Fehler beim Laden der Registrierungen für Event ${event.id}:`, err);
                        return {
                            ...event,
                            registrationCount: 0
                        };
                    }
                })
            );
            
            return eventsWithRegistrations;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    useEffect (() => {
        async function loadEvents() {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchEventsData();
                setEvents(data);
            } catch (err: any) {
                setError("Fehler beim Laden der Eventdaten: " + err.message);
            } finally {
                setIsLoading(false);
            }
        }
        loadEvents();
    }, []);
    
    if (isLoading) {
        return <div className="grid-list-container">Lade Events...</div>;
    }

    if (error) {
        return <div className="grid-list-container" style={{ color: "red" }}>Fehler: {error}</div>;
    }

    if (events.length === 0) {
        return <div className="grid-list-container">Keine Events gefunden.</div>;
    }

    const handleViewEvent = async (event: Event) => {
        if (onViewStart) {
            onViewStart(event);
        }
    }

    return (
        <div className="grid-list-container">
            {events.map((e) => (
                <EventCard 
                    onEdit={handleEditEvent} 
                    onView={handleViewEvent}
                    key={e.id} 
                    event={e}
                    registrationCount={e.registrationCount || 0}
                />
            ))}
        </div>
    );
};
export default EventList;
