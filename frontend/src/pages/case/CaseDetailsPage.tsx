import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck, Users, Plus, Loader2 } from "lucide-react";
import { VerificationHRAPI } from "../../api/verificationSettings.api";
import VerificationTimeline from "../../components/verification/VerificationTimeline";

import type {
  VerificationCaseDTO,
  VerificationItemDTO,
} from "../../types/verification";

/* -------------------------------------------------- */
/* STATUS BADGE */
/* -------------------------------------------------- */

const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    clear: "bg-green-500/20 text-green-400",
    failed: "bg-red-500/20 text-red-400",
    discrepancy: "bg-orange-500/20 text-orange-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
};

/* -------------------------------------------------- */
/* CONTACT MODAL */
/* -------------------------------------------------- */

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    phone?: string;
  }) => Promise<void>;
}

const ContactModal = ({ isOpen, onClose, onSubmit }: ContactModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    await onSubmit({ name, email, phone });
    setLoading(false);
    setName("");
    setEmail("");
    setPhone("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0F172A] p-6 rounded-xl w-full max-w-md border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">Add Contact</h2>

        <div className="space-y-3">
          <input
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="text-white/50 text-sm">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-medium text-white flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------- */
/* MAIN PAGE */
/* -------------------------------------------------- */
const CaseDetailsPage = () => {
  const { caseId } = useParams<{ caseId: string }>();

    const [caseData, setCaseData] = useState<VerificationCaseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<VerificationItemDTO | null>(null);

  /* Fetch Case */

  const fetchCase = async () => {
    if (!caseId) return;
    setLoading(true);
    const data = await VerificationHRAPI.getCaseById(caseId);
    setCaseData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCase();
  }, [caseId]);

  /* Add Contact */

  const handleAddContact = async (
    item: VerificationItemDTO,
    data: { name: string; email: string; phone?: string },
  ) => {
    if (!caseId) return;

    await VerificationHRAPI.addContact({
      verificationCaseId: caseId,
      verificationType: item.verificationType,
      contacts: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        organisationId: "ORG_ID",
        designationId: "DESIG_ID",
      },
    });

    await fetchCase(); // refresh after adding contact
  };

  /* ---------------- LOADING STATE ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1020]">
        <Loader2 className="animate-spin text-white" />
      </div>
    );
  }

  /* ---------------- NOT FOUND ---------------- */

  if (!caseData) {
    return <div className="text-white p-10">Case not found.</div>;
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#0B1020] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Verification Case
            </h1>
            <p className="text-white/50 text-sm">
              Candidate ID: {caseData.candidateId}
            </p>
          </div>

          <StatusBadge status={caseData.status} />
        </div>

        {/* ITEMS */}
        <div className="grid md:grid-cols-2 gap-6">
          {caseData.items.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-orange-400 w-5 h-5" />
                  <h3 className="text-white font-medium">
                    {item.verificationTypeConfigId}
                  </h3>
                </div>

                <StatusBadge status={item.status} />
              </div>

              <div className="mt-4 text-sm text-white/60 space-y-1">
                <p>
                  Mode:{" "}
                  <span className="text-white">{item.executionMode}</span>
                </p>
                <p>
                  Mandatory:{" "}
                  <span className="text-white">
                    {item.mandatory ? "Yes" : "No"}
                  </span>
                </p>
              </div>

              {/* CONTACTS */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">m 
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Users className="w-4 h-4" />
                    Contacts
                  </div>

                  <button
                    onClick={() => setActiveItem(item)}
                    className="text-orange-400 text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {item.contacts.length === 0 && (
                    <p className="text-xs text-white/40">
                      No contacts added
                    </p>
                  )}

                  {item.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    >
                      <p className="text-white">{contact.name}</p>
                      <p className="text-white/40 text-xs">
                        {contact.email}
                      </p>
                      <p className="text-white/40 text-xs">
                        Status: {contact.source}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <ContactModal
        isOpen={!!activeItem}
        onClose={() => setActiveItem(null)}
        onSubmit={async (data) => {
          if (!activeItem) return;
          await handleAddContact(activeItem, data);
        }}
      />
      <VerificationTimeline events={caseData.timeline} />
    </div>
  );
};

export default CaseDetailsPage;
