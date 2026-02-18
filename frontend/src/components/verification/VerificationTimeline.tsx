import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Mail,
  UserPlus,
  FileCheck,
} from "lucide-react";
import type { VerificationTimelineEventDTO } from "../../types/verification";

const iconMap = {
  CASE_CREATED: FileCheck,
  CONTACT_ADDED: UserPlus,
  EMAIL_SENT: Mail,
  RESPONSE_RECEIVED: CheckCircle,
  VERIFICATION_COMPLETED: CheckCircle,
  DISCREPANCY_FOUND: AlertTriangle,
};

const colorMap = {
  CASE_CREATED: "text-blue-400 bg-blue-400/10",
  CONTACT_ADDED: "text-orange-400 bg-orange-400/10",
  EMAIL_SENT: "text-purple-400 bg-purple-400/10",
  RESPONSE_RECEIVED: "text-green-400 bg-green-400/10",
  VERIFICATION_COMPLETED: "text-green-400 bg-green-400/10",
  DISCREPANCY_FOUND: "text-red-400 bg-red-400/10",
};


const formatDateTime = (date: string) => {
  const d = new Date(date);

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


interface Props {
  events: VerificationTimelineEventDTO[];
}

const VerificationTimeline = ({ events }: Props) => {
  if (!events || events.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <p className="text-white/40 text-sm">No activity yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-lg">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-4 h-4 text-orange-400" />
        <h2 className="text-white font-semibold">Verification Timeline</h2>
      </div>

      {/* TIMELINE */}
      <div className="relative border-l border-white/10 ml-3 space-y-6">
        {events.map((event) => {
          const Icon = iconMap[event.type];
          const color = colorMap[event.type];

          return (
            <div key={event.id} className="relative pl-6">
              {/* DOT */}
              <div
                className={`absolute -left-[13px] top-1 w-6 h-6 rounded-full flex items-center justify-center ${color}`}
              >
                <Icon className="w-3 h-3" />
              </div>

              {/* CONTENT */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium">
                    {event.title}
                  </p>

                  <span className="text-xs text-white/40">
                    {formatDateTime(event.timestamp)}
                  </span>
                </div>

                {event.description && (
                  <p className="text-xs text-white/50 mt-1">
                    {event.description}
                  </p>
                )}

                {event.actor && (
                  <p className="text-xs text-white/30 mt-1">
                    by {event.actor}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationTimeline;
