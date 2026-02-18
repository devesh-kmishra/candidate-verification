import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Loader2,
  ShieldCheck,
  Users,
  AlertTriangle,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { VerificationHRAPI } from "../../api/verificationSettings.api";
import type {
  VerificationItemDTO,
  VerificationContactDTO,
  VerificationTimelineEventDTO,
} from "../../types/verification";

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    completed: "bg-green-500/20 text-green-400",
    discrepancy: "bg-red-500/20 text-red-400",
    in_progress: "bg-blue-500/20 text-blue-400",
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-full ${map[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

const Timeline = ({ events }: { events: VerificationTimelineEventDTO[] }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <h3 className="text-white font-medium mb-4">Activity Timeline</h3>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex gap-3">
            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2" />

            <div>
              <p className="text-white text-sm">{event.title}</p>

              {event.description && (
                <p className="text-white/50 text-xs">{event.description}</p>
              )}

              <p className="text-white/40 text-xs">
                {new Date(event.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactCard = ({
  contact,
  onResend,
}: {
  contact: VerificationContactDTO;
  onResend: () => Promise<void>;
}) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="flex justify-between">
        <div>
          <p className="text-white font-medium">{contact.name}</p>

          <p className="text-white/50 text-sm">{contact.email}</p>

          <p className="text-white/40 text-xs">Status: {contact.source}</p>
        </div>

        <button
          onClick={onResend}
          className="text-orange-400 hover:text-orange-300"
        >
          <Mail size={18} />
        </button>
      </div>

      {/* RESPONSES */}

      {contact.response?.length > 0 && (
        <div className="mt-3 space-y-2">
          {contact.response.map((responses) => {
            const mismatch =
              responses.expectedValue &&
              responses.actualValue &&
              responses.expectedValue !== responses.actualValue;

            return (
              <div
                key={responses.id}
                className={`p-2 rounded text-sm ${
                  mismatch
                    ? "bg-red-500/10 border border-red-500/30"
                    : "bg-green-500/10 border border-green-500/30"
                }`}
              >
                <p className="text-white/70">{responses.question}</p>

                <p className="text-white">Answer: {responses.actualValue}</p>

                {mismatch && (
                  <p className="text-red-400 text-xs flex gap-1 items-center">
                    <AlertTriangle size={14} />
                    Expected: {responses.expectedValue}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------- */
/* MAIN PAGE */
/* -------------------------------------------------- */

const VerificationItemDetailsPage = () => {
  const { caseId, itemId } = useParams<{
    caseId: string;
    itemId: string;
  }>();

  const [item, setItem] = useState<VerificationItemDTO | null>(null);

  const [timeline, setTimeline] = useState<VerificationTimelineEventDTO[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* -------------------------------------------------- */
  /* FETCH */
  /* -------------------------------------------------- */

  const fetchItem = async () => {
    try {
      if (!caseId || !itemId) return;

      setLoading(true);

      const res = await VerificationHRAPI.getVerificationItem(caseId, itemId);

      setItem(res.item);

      setTimeline(res.timeline || []);
    } catch (err) {
      setError("Failed to load item");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  /* -------------------------------------------------- */
  /* ACTIONS */
  /* -------------------------------------------------- */

  const resendContact = async (contactId: string) => {
    if (!caseId || !itemId) return;

    await VerificationHRAPI.resendContact(caseId, itemId, contactId);

    fetchItem();
  };

  const markComplete = async () => {
    if (!caseId || !itemId) return;

    await VerificationHRAPI.markItemComplete(caseId, itemId);

    fetchItem();
  };

  /* -------------------------------------------------- */
  /* STATES */
  /* -------------------------------------------------- */

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0B1020]">
        <Loader2 className="animate-spin text-white" />
      </div>
    );

  if (error) return <div className="text-red-400 p-10">{error}</div>;

  if (!item) return <div className="text-white p-10">Item not found</div>;

  /* -------------------------------------------------- */
  /* RENDER */
  /* -------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#0B1020] p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}

        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <ShieldCheck className="text-orange-400" />

            <div>
              <h1 className="text-white text-xl font-semibold">
                {item.verificationType}
              </h1>

              <p className="text-white/50 text-sm">
                Execution Mode: {item.executionMode}
              </p>
            </div>
          </div>

          <StatusBadge status={item.status} />
        </div>

        {/* CONTACTS */}

        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex justify-between mb-4">
            <h3 className="text-white font-medium flex gap-2 items-center">
              <Users size={18} />
              Contacts
            </h3>

            <button
              onClick={markComplete}
              className="flex gap-2 items-center bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-sm text-white"
            >
              <CheckCircle2 size={16} />
              Mark Complete
            </button>
          </div>

          <div className="space-y-3">
            {item.contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onResend={() => resendContact(contact.id)}
              />
            ))}
          </div>
        </div>

        {/* TIMELINE */}

        <Timeline events={timeline} />
      </div>
    </div>
  );
};

export default VerificationItemDetailsPage;
