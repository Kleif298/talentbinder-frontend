import { useState } from "react";
import Header from "~/components/Header/Header.tsx";
import EventList from "~/components/EventList/EventList.tsx";
import EventModal from "~/components/EventModal/EventModal.tsx";
import InfoModal from "~/components/InfoModal/InfoModal.tsx";
import MessageBanner, { type Message } from "~/components/MessageBanner/MessageBanner.tsx";
import type { Event, EventForm } from "~/types/Event";
import { eventsAPI } from "~/api/eventsAPI";

import "./Events.scss";

const Events = () => {
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [message, setMessage] = useState<Message | null>(null);

    const handleCreateEvent = async (eventData: EventForm) => {
        try {
            setMessage({ type: "info", text: "Speichere Event..." });
            await eventsAPI.create(eventData);
            setMessage({ type: "success", text: "Event erfolgreich erstellt!" });
            setRefreshKey(prev => prev + 1);
        } catch (err: any) {
            setMessage({ type: "error", text: `Fehler: ${err.message}` });
            console.error("Fehler beim Erstellen:", err.message);
        }
    };

    const handleEditEvent = async (eventData: EventForm) => {
        if (!eventToEdit) return;
        try {
            setMessage({ type: "info", text: "Aktualisiere Event..." });
            await eventsAPI.update(eventToEdit.id, eventData);
            setEventToEdit(null);
            setMessage({ type: "success", text: "Event erfolgreich aktualisiert!" });
            setRefreshKey(prev => prev + 1);
        } catch (err: any) {
            setMessage({ type: "error", text: `Fehler: ${err.message}` });
            console.error("Fehler beim Bearbeiten:", err.message);
        }
    };

    const handleDeleteEvent = async (eventId: number) => {
        if (!window.confirm("Sind Sie sicher, dass Sie dieses Event löschen möchten?")) {
            return;
        }
        
        try {
            setMessage({ type: "info", text: "Lösche Event..." });
            await eventsAPI.delete(eventId);
            setMessage({ type: "success", text: "Event erfolgreich gelöscht!" });
            setRefreshKey(prev => prev + 1);
        } catch (err: any) {
            setMessage({ type: "error", text: `Fehler beim Löschen: ${err.message}` });
            console.error("Fehler beim Löschen:", err.message);
        }
    };

    const handleCloseModal = () => {
        setEventToEdit(null);
    };

    return (
        <div className="event-dashboard-page">
            <Header />
            <MessageBanner message={message} onClose={() => setMessage(null)} />
            <div className={`event-frame ${selectedEvent ? 'split-view' : ''}`}>
                <div className="event-list-section">
                    <div className="head-of-list">
                        <div className="head-of-list-content">
                            <EventModal 
                                eventToEdit={eventToEdit} 
                                onSave={eventToEdit ? handleEditEvent : handleCreateEvent}
                                onClose={handleCloseModal}
                                onDelete={handleDeleteEvent}
                            />
                        </div>
                    </div>
                    <EventList 
                        key={refreshKey}
                        onEditStart={(event) => setEventToEdit(event)}
                        onViewStart={(event) => setSelectedEvent(event)}
                    />
                </div>
                {selectedEvent && (
                    <InfoModal
                        event={selectedEvent}
                        isOpen={!!selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default Events;
