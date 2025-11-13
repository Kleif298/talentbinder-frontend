import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "./EventCreationPage.scss";
import type { Event, EventForm } from "../../types/Event";
import { eventsAPI } from "../../api/eventsAPI";
import { lookupAPI, type Location, type EventType, type Branch } from "../../api/lookupAPI";

interface EventCreationPageProps {
  event?: Event | null;
  onBack: () => void;
  onSuccess?: () => void;
}

const EventCreationPage = ({ event, onBack, onSuccess }: EventCreationPageProps) => {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);
  
  const [formData, setFormData] = useState<EventForm>({
    title: "",
    description: "",
    branchId: undefined,
    templateId: undefined,
    locationId: undefined,
    registrationRequired: false,
    dateAt: "",
    startingAt: "",
    endingAt: "",
    invitationsSendingAt: "",
    registrationsClosingAt: "",
  });

  // Load locations, event types, and branches on mount
  useEffect(() => {
    const loadLookupData = async () => {
      setLoadingLookups(true);
      try {
        const [locationsData, eventTypesData, branchesData] = await Promise.all([
          lookupAPI.getLocations(),
          lookupAPI.getEventTypes(),
          lookupAPI.getBranches(),
        ]);
        setLocations(locationsData);
        setEventTypes(eventTypesData);
        setBranches(branchesData);
      } catch (err: any) {
        console.error("Error loading data:", err);
      } finally {
        setLoadingLookups(false);
      }
    };
    loadLookupData();
  }, []);

  // Pre-fill form if editing an event
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        branchId: event.branchId || undefined,
        templateId: event.templateId || undefined,
        locationId: event.locationId || undefined,
        registrationRequired: event.registrationRequired || false,
        dateAt: event.dateAt || "",
        startingAt: event.startingAt || "",
        endingAt: event.endingAt || "",
        invitationsSendingAt: event.invitationsSendingAt || "",
        registrationsClosingAt: event.registrationsClosingAt || "",
      });
    }
  }, [event]);

  // Auto-fill from template when template is selected
  const handleTemplateChange = (templateValue: string) => {
    if (!templateValue) {
      setFormData(prev => ({ ...prev, templateId: undefined }));
      return;
    }
    const templateId = Number(templateValue);
    const selectedTemplate = eventTypes.find(t => t.templateId === templateId);
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        templateId,
        title: selectedTemplate.title,
        description: selectedTemplate.description || prev.description,
        locationId: selectedTemplate.locationId,
        registrationRequired: selectedTemplate.registrationsRequired,
        startingAt: selectedTemplate.startingAt || prev.startingAt,
        endingAt: selectedTemplate.endingAt || prev.endingAt,
      }));
    } else {
      setFormData(prev => ({ ...prev, templateId }));
    }
  };

  const handleRegistrationToggle = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      registrationRequired: checked,
      invitationsSendingAt: checked ? prev.invitationsSendingAt : "",
      registrationsClosingAt: checked ? prev.registrationsClosingAt : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      if (event) {
        await eventsAPI.update(event.id, formData);
      } else {
        await eventsAPI.create(formData);
      }

      if (onSuccess) {
        onSuccess();
      }
      onBack();
    } catch (err: any) {
      console.error("Error saving event:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-creation-page">
      <div className="event-creation-header">
        <button className="back-button" onClick={onBack} type="button">
          <FaArrowLeft />
          <span>Zurück</span>
        </button>
        <div>
          <h1 className="page-title">{event ? "Edit Event" : "Create Event"}</h1>
          <p className="page-subtitle">
            {event ? "Update event details" : "Select a template to get started quickly"}
          </p>
        </div>
      </div>

      <div className="event-creation-content">
        {loadingLookups ? (
          <div className="loading-state">
            <p>Loading...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="event-form">
            {/* Event Template Card */}
            <div className="form-card">
              <div className="card-header">
                <h3 className="card-title">Event Template</h3>
              </div>
              <div className="card-content">
                <div className="form-group">
                  <select
                    className="form-select"
                    value={formData.templateId || ""}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                  >
                    <option value="">Select a template...</option>
                    {eventTypes.map((template) => (
                      <option key={template.templateId} value={template.templateId}>
                        {template.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Show form only if template is selected */}
            {formData.templateId && (
              <>
                {/* Event Information Card */}
                <div className="form-card">
                  <div className="card-header">
                    <h3 className="card-title">Event Information</h3>
                  </div>
                  <div className="card-content">
                    <div className="form-group">
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
                      <input
                        id="title"
                        type="text"
                        className="form-input"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <textarea
                        id="description"
                        className="form-textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="branch" className="form-label">
                        Branch (Optional)
                      </label>
                      <select
                        id="branch"
                        className="form-select"
                        value={formData.branchId || ""}
                        onChange={(e) => setFormData({ ...formData, branchId: Number(e.target.value) || undefined })}
                      >
                        <option value="">All Branches</option>
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="location" className="form-label">
                        Location
                      </label>
                      <select
                        id="location"
                        className="form-select"
                        value={formData.locationId || ""}
                        onChange={(e) => setFormData({ ...formData, locationId: Number(e.target.value) || undefined })}
                        required
                      >
                        <option value="">Select location...</option>
                        {locations.map((location) => (
                          <option key={location.locationId} value={location.locationId}>
                            {location.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="dateAt" className="form-label">
                          Date
                        </label>
                        <input
                          id="dateAt"
                          type="date"
                          className="form-input"
                          value={formData.dateAt}
                          onChange={(e) => setFormData({ ...formData, dateAt: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="startingAt" className="form-label">
                          Start Time
                        </label>
                        <input
                          id="startingAt"
                          type="time"
                          className="form-input"
                          value={formData.startingAt}
                          onChange={(e) => setFormData({ ...formData, startingAt: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="endingAt" className="form-label">
                          End Time
                        </label>
                        <input
                          id="endingAt"
                          type="time"
                          className="form-input"
                          value={formData.endingAt}
                          onChange={(e) => setFormData({ ...formData, endingAt: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration & Candidates Card */}
                <div className="form-card">
                  <div className="card-header">
                    <h3 className="card-title">Registration & Candidates</h3>
                  </div>
                  <div className="card-content">
                    <div className="checkbox-wrapper">
                      <input
                        id="needsRegistration"
                        type="checkbox"
                        className="form-checkbox"
                        checked={formData.registrationRequired || false}
                        onChange={(e) => handleRegistrationToggle(e.target.checked)}
                      />
                      <label htmlFor="needsRegistration" className="checkbox-label">
                        This event requires registration
                      </label>
                    </div>

                    {formData.registrationRequired && (
                      <div className="registration-dates">
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="invitationsSendingAt" className="form-label">
                              Registration Opens
                            </label>
                            <input
                              id="invitationsSendingAt"
                              type="date"
                              className="form-input"
                              value={formData.invitationsSendingAt}
                              onChange={(e) => setFormData({ ...formData, invitationsSendingAt: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="registrationsClosingAt" className="form-label">
                              Registration Closes
                            </label>
                            <input
                              id="registrationsClosingAt"
                              type="date"
                              className="form-input"
                              value={formData.registrationsClosingAt}
                              onChange={(e) => setFormData({ ...formData, registrationsClosingAt: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? "Saving..." : event ? "Save Changes" : "Create Event"}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default EventCreationPage;
