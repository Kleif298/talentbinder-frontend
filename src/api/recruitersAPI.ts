const API_BASE = "http://localhost:4000/api";

export const recruitersAPI = {
  /**
   * Abrufen aller verfügbaren Accounts (Recruiter)
   */
  getAllAccounts: async () => {
    try {
      const res = await fetch(`${API_BASE}/accounts`, {
        credentials: "include"
      });

      if (!res.ok) {
        console.warn(`recruitersAPI: Got status ${res.status}, returning empty list`);
        return [];
      }

      const data = await res.json();
      if (data.success) {
        return data.accounts || [];
      }
      console.warn('recruitersAPI: Response success=false:', data.message);
      return [];
    } catch (err: any) {
      console.error('recruitersAPI: Error in getAllAccounts:', err);
      return [];
    }
  },

  /**
   * Abrufen aller Recruiter für ein Event
   */
  getEventRecruiters: async (eventId: number) => {
    try {
      const res = await fetch(`${API_BASE}/events/${eventId}/recruiters`, {
        credentials: "include"
      });

      if (!res.ok) {
        console.warn(`recruitersAPI: Got status ${res.status}, returning empty list`);
        return [];
      }

      const data = await res.json();
      if (data.success) {
        return data.recruiters || [];
      }
      console.warn('recruitersAPI: Response success=false:', data.message);
      return [];
    } catch (err: any) {
      console.error('recruitersAPI: Error in getEventRecruiters:', err);
      return [];
    }
  },

  /**
   * Event-Registrierungen abrufen
   */
  getEventRegistrations: async (eventId: number) => {
    try {
      const res = await fetch(`${API_BASE}/events/${eventId}/registrations`, {
        credentials: "include"
      });

      if (!res.ok) {
        console.warn(`recruitersAPI: Got status ${res.status}, returning 0 registrations`);
        return { count: 0, registrations: [] };
      }

      const data = await res.json();
      if (data.success) {
        return {
          count: data.count || 0,
          registrations: data.registrations || []
        };
      }
      console.warn('recruitersAPI: Response success=false:', data.message);
      return { count: 0, registrations: [] };
    } catch (err: any) {
      console.error('recruitersAPI: Error in getEventRegistrations:', err);
      return { count: 0, registrations: [] };
    }
  },

  /**
   * Recruiter zu Event hinzufügen
   */
  addRecruiterToEvent: async (eventId: number, recruiterId: number) => {
    try {
      const res = await fetch(`${API_BASE}/events/${eventId}/recruiters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ recruiter_id: recruiterId })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server error: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.success) {
        return data;
      }
      throw new Error(data.message || "Fehler beim Hinzufügen des Recruiters");
    } catch (err: any) {
      console.error('recruitersAPI: Error in addRecruiterToEvent:', err);
      throw err;
    }
  },

  /**
   * Recruiter vom Event entfernen
   */
  removeRecruiterFromEvent: async (eventId: number, recruiterId: number) => {
    try {
      const res = await fetch(`${API_BASE}/events/${eventId}/recruiters/${recruiterId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server error: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.success) {
        return data;
      }
      throw new Error(data.message || "Fehler beim Entfernen des Recruiters");
    } catch (err: any) {
      console.error('recruitersAPI: Error in removeRecruiterFromEvent:', err);
      throw err;
    }
  },

  /**
   * Kandidat zu Event-Registrierung hinzufügen
   */
  addCandidateToEvent: async (eventId: number, candidateId: number) => {
    try {
      const res = await fetch(`${API_BASE}/events/${eventId}/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ candidate_id: candidateId })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server error: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.success) {
        return data;
      }
      throw new Error(data.message || "Fehler beim Hinzufügen des Kandidaten");
    } catch (err: any) {
      console.error('recruitersAPI: Error in addCandidateToEvent:', err);
      throw err;
    }
  },

  /**
   * Kandidat von Event-Registrierung entfernen
   */
  removeCandidateFromEvent: async (eventId: number, candidateId: number) => {
    try {
      const res = await fetch(`${API_BASE}/events/${eventId}/registrations/${candidateId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server error: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.success) {
        return data;
      }
      throw new Error(data.message || "Fehler beim Entfernen des Kandidaten");
    } catch (err: any) {
      console.error('recruitersAPI: Error in removeCandidateFromEvent:', err);
      throw err;
    }
  }
};