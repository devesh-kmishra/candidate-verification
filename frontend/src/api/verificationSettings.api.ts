import axios from "axios";

import type {
  AddVerificationContactPayload,
  CreateVerificationCasePayload,
  SaveVerificationConfigPayload,
  SubmitVerificationResponsePayload,
  VerificationCaseDTO,
  VerificationConfigDTO,
  VerificationItemDTO,
  VerificationTimelineEventDTO,
} from "../types/verification";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/* =====================================
   ADMIN – VERIFICATION SETTINGS
===================================== */

export const VerificationAdminAPI = {
  getActiveConfig(): Promise<VerificationConfigDTO> {
    return axios
      .get(`${API_BASE_URL}/admin/verification/config`)
      .then((res) => res.data);
  },

  saveConfig(
    payload: SaveVerificationConfigPayload,
  ): Promise<VerificationConfigDTO> {
    return axios
      .post(`${API_BASE_URL}/admin/verification/config`, payload)
      .then((res) => res.data);
  },

  deactivateConfig(): Promise<void> {
    return axios.post(`${API_BASE_URL}/admin/verification/config/deactivate`);
  },
};

/* =====================================
   HR – VERIFICATION CASES
===================================== */

export const VerificationHRAPI = {
  /* EXISTING APIs (unchanged) */

  createVerificationCase(
    payload: CreateVerificationCasePayload,
  ): Promise<VerificationCaseDTO> {
    return axios
      .post(`${API_BASE_URL}/hr/verification/cases`, payload)
      .then((res) => res.data);
  },

  getCaseByCandidate(candidateId: string): Promise<VerificationCaseDTO> {
    return axios
      .get(`${API_BASE_URL}/hr/verification/cases/candidate/${candidateId}`)
      .then((res) => res.data);
  },

  getCaseById(caseId: string): Promise<VerificationCaseDTO> {
    return axios
      .get(`${API_BASE_URL}/hr/verification/cases/${caseId}`)
      .then((res) => res.data);
  },

  addContact(payload: AddVerificationContactPayload): Promise<void> {
    return axios.post(`${API_BASE_URL}/hr/verification/contacts`, payload);
  },

  startVerification(caseId: string): Promise<{ success: boolean }> {
    return axios
      .post(`${API_BASE_URL}/hr/verification/cases/${caseId}/start`)
      .then((res) => res.data);
  },

  /* NEW ENTERPRISE APIs */

  getVerificationItem(
    caseId: string,
    itemId: string,
  ): Promise<{
    item: VerificationItemDTO;
    timeline: VerificationTimelineEventDTO[];
  }> {
    return axios
      .get(`${API_BASE_URL}/hr/verification/cases/${caseId}/items/${itemId}`)
      .then((res) => res.data);
  },

  resendContact(
    caseId: string,
    itemId: string,
    contactId: string,
  ): Promise<void> {
    return axios.post(
      `${API_BASE_URL}/hr/verification/cases/${caseId}/items/${itemId}/contacts/${contactId}/resend`,
    );
  },

  markItemComplete(caseId: string, itemId: string): Promise<void> {
    return axios.post(
      `${API_BASE_URL}/hr/verification/cases/${caseId}/items/${itemId}/complete`,
    );
  },

  getCaseTimeline(caseId: string) {
    return axios
      .get(`${API_BASE_URL}/hr/verification/cases/${caseId}/timeline`)
      .then((res) => res.data);
  },

  requestClarification(caseId: string, itemId: string, message: string) {
    return axios.post(
      `${API_BASE_URL}/hr/verification/cases/${caseId}/items/${itemId}/clarification`,
      { message },
    );
  },
};

/* =====================================
   CONTACT – EXTERNAL VERIFICATION
===================================== */

export const VerificationContactAPI = {
  getVerificationByToken(token: string) {
    return axios.get(`${API_BASE_URL}/verify/${token}`).then((res) => res.data);
  },

  submitResponse(payload: SubmitVerificationResponsePayload): Promise<void> {
    return axios.post(`${API_BASE_URL}/verify/submit`, payload);
  },
};

/* =====================================
   SHARED / COMMON
===================================== */

export const VerificationCommonAPI = {
  getVerificationSummary(caseId: string) {
    return axios
      .get(`${API_BASE_URL}/verification/cases/${caseId}/summary`)
      .then((res) => res.data);
  },

  overrideDiscrepancy(
    discrepancyId: string,
    resolutionNote: string,
  ): Promise<void> {
    return axios.post(
      `${API_BASE_URL}/verification/discrepancies/${discrepancyId}/override`,
      { resolutionNote },
    );
  },
};
