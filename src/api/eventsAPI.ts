/**
 * Events API Service
 * Zentrale Stelle für alle Event-API-Aufrufe
 */

import type { Event, EventForm } from "../types/Event";

const API_BASE = "http://localhost:4000/api";

export const eventsAPI = {
  /**
   * Abrufen aller Events
   */
  getAll: async (): Promise<Event[]> => {
    const res = await fetch(`${API_BASE}/events`, { credentials: "include" });

    const data = await res.json();
    
    if (!res.ok) {
      // Spezifische Fehlerbehandlung für Authentifizierungsfehler
      if (res.status === 401) {
        throw new Error("Bitte melden Sie sich an, um fortzufahren.");
      } else if (res.status === 403) {
        throw new Error("Sie haben keine Berechtigung für diese Aktion.");
      }
      throw new Error(data.message || "Server error: " + res.statusText);
    }

    if (data.success && Array.isArray(data.events)) {
      return data.events as Event[];
    }
    throw new Error(data.message || "Fehler beim Abrufen der Events");
  },

  /**
   * Neues Event erstellen
   */
  create: async (event: EventForm): Promise<Event> => {
    const res = await fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: event.title,
        description: event.description,
        startingAt: event.startingAt,
        duration: event.duration,
        invitationsSendingAt: event.invitationsSendingAt,
        registrationsClosingAt: event.registrationsClosingAt,
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      // Spezifische Fehlerbehandlung für Authentifizierungsfehler
      if (res.status === 401) {
        throw new Error("Bitte melden Sie sich an, um fortzufahren.");
      } else if (res.status === 403) {
        throw new Error("Sie haben keine Berechtigung für diese Aktion.");
      }
      throw new Error(data.message || "Server error: " + res.statusText);
    }

    if (data.success) {
      return data.event;
    }
    throw new Error(data.message || "Fehler beim Erstellen des Events");
  },

  /**
   * Event aktualisieren
   */
  update: async (id: number, event: EventForm): Promise<Event> => {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: event.title,
        description: event.description,
        startingAt: event.startingAt,
        duration: event.duration,
        invitationsSendingAt: event.invitationsSendingAt,
        registrationsClosingAt: event.registrationsClosingAt,
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      // Spezifische Fehlerbehandlung für Authentifizierungsfehler
      if (res.status === 401) {
        throw new Error("Bitte melden Sie sich an, um fortzufahren.");
      } else if (res.status === 403) {
        throw new Error("Sie haben keine Berechtigung für diese Aktion.");
      }
      throw new Error(data.message || "Server error: " + res.statusText);
    }

    if (data.success) {
      return data.event;
    }
    throw new Error(data.message || "Fehler beim Aktualisieren des Events");
  },

  /**
   * Event löschen
   */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    
    if (!res.ok) {
      // Spezifische Fehlerbehandlung für Authentifizierungsfehler
      if (res.status === 401) {
        throw new Error("Bitte melden Sie sich an, um fortzufahren.");
      } else if (res.status === 403) {
        throw new Error("Sie haben keine Berechtigung für diese Aktion.");
      }
      throw new Error(data.message || "Server error: " + res.statusText);
    }

    if (!data.success) {
      throw new Error(data.message || "Fehler beim Löschen des Events");
    }
  },
};
