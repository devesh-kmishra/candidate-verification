import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

/**
 * ============================================
 * TYPES
 * ============================================
 */

type VerificationItemType = "EMPLOYMENT" | "EDUCATION" | "REFERENCE";

interface VerificationItemDTO {
  id: string;
  type: VerificationItemType;
  label: string;
  description: string;
  required: boolean;
}

interface VerificationCaseDTO {
  id: string;
  candidateName: string;
  items: VerificationItemDTO[];
}

interface ContactFormData {
  itemId: string;
  verifierName: string;
  verifierEmail: string;
  verifierPhone: string;
  organization: string;
  designation: string;
}

/**
 * ============================================
 * API CONFIG
 * ============================================
 */

const API_URL = import.meta.env.API_BASE_URL;

const VerificationCandidateAPI = {
  getCaseByToken(token: string): Promise<VerificationCaseDTO> {
    return axios
      .get(`${API_URL}/candidate/verification/${token}`)
      .then((res) => res.data);
  },

  submitContacts(token: string, contacts: ContactFormData[]): Promise<void> {
    return axios.post(`${API_URL}/candidate/verification/${token}/contacts`, {
      contacts,
    });
  },

  submitVerification(token: string): Promise<void> {
    return axios.post(`${API_URL}/candidate/verification/${token}/submit`);
  },
};

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

export default function CandidateVerificationForm() {
  const { token } = useParams<{ token: string }>();

  const [caseData, setCaseData] = useState<VerificationCaseDTO | null>(null);

  const [contacts, setContacts] = useState<Record<string, ContactFormData>>({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /**
   * ============================================
   * LOAD CASE DATA
   * ============================================
   */

  useEffect(() => {
    if (!token) {
      setError("Invalid verification link.");
      setLoading(false);
      return;
    }

    VerificationCandidateAPI.getCaseByToken(token)
      .then((data) => {
        setCaseData(data);

        // initialize contacts state
        const initialContacts: Record<string, ContactFormData> = {};

        data.items.forEach((item) => {
          initialContacts[item.id] = {
            itemId: item.id,
            verifierName: "",
            verifierEmail: "",
            verifierPhone: "",
            organization: "",
            designation: "",
          };
        });

        setContacts(initialContacts);
      })
      .catch(() => setError("Verification link expired or invalid."))
      .finally(() => setLoading(false));
  }, [token]);

  /**
   * ============================================
   * HANDLE INPUT CHANGE
   * ============================================
   */

  function handleChange(
    itemId: string,
    field: keyof ContactFormData,
    value: string,
  ) {
    setContacts((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  }

  /**
   * ============================================
   * VALIDATION
   * ============================================
   */

  function validate(): string | null {
    for (const contact of Object.values(contacts)) {
      if (!contact.verifierName) return "Verifier name required";

      if (!contact.verifierEmail) return "Verifier email required";

      if (!contact.organization) return "Organization required";
    }

    return null;
  }

  /**
   * ============================================
   * SUBMIT FORM
   * ============================================
   */

  async function handleSubmit() {
    if (!token) return;

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await VerificationCandidateAPI.submitContacts(
        token,
        Object.values(contacts),
      );

      await VerificationCandidateAPI.submitVerification(token);

      setSuccess(true);
    } catch {
      setError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * ============================================
   * LOADING STATE
   * ============================================
   */

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading verification form...
      </div>
    );

  if (error && !caseData)
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {error}
      </div>
    );

  /**
   * ============================================
   * SUCCESS STATE
   * ============================================
   */

  if (success)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-white shadow-xl rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-green-600">
            Verification Submitted Successfully
          </h2>

          <p className="mt-2 text-gray-600">
            Thank you. Your verification process has started.
          </p>
        </div>
      </div>
    );

  /**
   * ============================================
   * MAIN FORM UI
   * ============================================
   */

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-10">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl">
        {/* HEADER */}
        <h1 className="text-2xl font-semibold mb-2">Candidate Verification</h1>

        <p className="text-gray-600 mb-6">
          Candidate: {caseData?.candidateName}
        </p>

        {/* ITEMS */}
        <div className="space-y-6">
          {caseData?.items.map((item) => {
            const contact = contacts[item.id];

            return (
              <div key={item.id} className="border rounded-lg p-5">
                <h3 className="font-semibold mb-1">{item.label}</h3>

                <p className="text-sm text-gray-500 mb-4">{item.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="input"
                    placeholder="Verifier Name"
                    value={contact.verifierName}
                    onChange={(e) =>
                      handleChange(item.id, "verifierName", e.target.value)
                    }
                  />

                  <input
                    className="input"
                    placeholder="Verifier Email"
                    value={contact.verifierEmail}
                    onChange={(e) =>
                      handleChange(item.id, "verifierEmail", e.target.value)
                    }
                  />

                  <input
                    className="input"
                    placeholder="Phone"
                    value={contact.verifierPhone}
                    onChange={(e) =>
                      handleChange(item.id, "verifierPhone", e.target.value)
                    }
                  />

                  <input
                    className="input"
                    placeholder="Organization"
                    value={contact.organization}
                    onChange={(e) =>
                      handleChange(item.id, "organization", e.target.value)
                    }
                  />

                  <input
                    className="input col-span-2"
                    placeholder="Designation"
                    value={contact.designation}
                    onChange={(e) =>
                      handleChange(item.id, "designation", e.target.value)
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ERROR */}
        {error && <div className="text-red-600 mt-4">{error}</div>}

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Verification"}
        </button>
      </div>

      {/* GLOBAL INPUT STYLE */}
      <style>
        {`
          .input {
            border: 1px solid #e2e8f0;
            padding: 10px;
            border-radius: 6px;
            width: 100%;
          }

          .input:focus {
            outline: none;
            border-color: #2563eb;
          }
        `}
      </style>
    </div>
  );
}
