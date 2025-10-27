/**
 * Candidates API Service
 * Zentrale Stelle für alle Kandidaten-API-Aufrufe
 */

import type { Candidate, CandidateForm } from "../types/Candidate";

const API_BASE = "http://localhost:4000/api/candidates";

export const candidatesAPI = {
  /**
   * Abrufen aller Kandidaten mit Filtern und Sortierung
   */
  getAll: async (search: string = "", status: string = "", sortBy: string = "created_at_desc"): Promise<Candidate[]> => {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (status) queryParams.append("status", status);
    if (sortBy) queryParams.append("sort_by", sortBy);

    const url = `${API_BASE}?${queryParams.toString()}`;
    const res = await fetch(url, { 
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        // Fallback, wenn die Antwort kein valides JSON ist
        throw new Error("Server error: " + res.statusText);
      }
      throw new Error(errorData.message || "Server error: " + res.statusText);
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.candidates)) {
      return data.candidates as Candidate[];
    }
    throw new Error(data.message || "Fehler beim Abrufen der Kandidaten");
  },

  /**
   * Neuen Kandidaten erstellen
   */
  create: async (candidate: CandidateForm): Promise<Candidate> => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        firstName: candidate.first_name,
        lastName: candidate.last_name,
        email: candidate.email,
        status: candidate.status,
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
      return data.candidate;
    }
    throw new Error(data.message || "Fehler beim Erstellen des Kandidaten");
  },

  /**
   * Kandidaten aktualisieren
   */
  update: async (id: number, candidate: Partial<CandidateForm>): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        firstName: candidate.first_name,
        lastName: candidate.last_name,
        email: candidate.email,
        status: candidate.status,
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

    if (!data.success) {
      throw new Error(data.message || "Fehler beim Aktualisieren des Kandidaten");
    }
  },

  /**
   * Kandidaten löschen
   */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, {
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
      throw new Error(data.message || "Fehler beim Löschen des Kandidaten");
    }
  },
};
