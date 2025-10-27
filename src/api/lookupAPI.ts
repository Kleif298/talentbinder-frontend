/**
 * Lookup API Service
 * Für Referenzdaten wie Apprenticeships und Branches
 */

export interface Apprenticeship {
  id: number;
  name: string;
  branchId: number;
}

export interface Branch {
  id: number;
  name: string;
}

const API_BASE = "http://localhost:4000/api";

export const lookupAPI = {
  /**
   * Abrufen aller Lehrstellen
   */
  getApprenticeships: async (): Promise<Apprenticeship[]> => {
    const res = await fetch(`${API_BASE}/apprenticeships`, { credentials: "include" });

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

    if (data.success && Array.isArray(data.apprenticeships)) {
      return data.apprenticeships as Apprenticeship[];
    }
    throw new Error(data.message || "Fehler beim Abrufen der Lehrstellen");
  },

  /**
   * Abrufen aller Branchen
   */
  getBranches: async (): Promise<Branch[]> => {
    const res = await fetch(`${API_BASE}/branches`, { credentials: "include" });

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

    if (data.success && Array.isArray(data.branches)) {
      return data.branches as Branch[];
    }
    throw new Error(data.message || "Fehler beim Abrufen der Branchen");
  },

  /**
   * Hilfsfunktion: Apprenticeship ID → Name konvertieren
   */
  getApprenticeshipName: async (apprenticeshipId: number | undefined): Promise<string> => {
    if (!apprenticeshipId) return "Nicht zugeordnet";
    
    try {
      const apprenticeships = await lookupAPI.getApprenticeships();
      const found = apprenticeships.find((a) => a.id === apprenticeshipId);
      return found ? found.name : "Unbekannt";
    } catch {
      return "Fehler beim Laden";
    }
  },

  /**
   * Hilfsfunktion: Branch ID → Name konvertieren
   */
  getBranchName: async (branchId: number | undefined): Promise<string> => {
    if (!branchId) return "Nicht zugeordnet";
    
    try {
      const branches = await lookupAPI.getBranches();
      const found = branches.find((b) => b.id === branchId);
      return found ? found.name : "Unbekannt";
    } catch {
      return "Fehler beim Laden";
    }
  },
};
