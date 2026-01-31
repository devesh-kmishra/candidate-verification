import {
  Camera,
  Mic,
  Sparkles,
  Clock,
  Circle,
  AlertTriangle,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type GuidelineProps = {
  icon: ReactNode;
  title: string;
  desc: string;
};

const Popup = () => {
  const navigate = useNavigate();
  const [consent, setConsent] = useState(false);
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 font-(--font-inter)
"
    >
      <div className="w-135 rounded-2xl border border-panelBorder bg-linear-to-b from-[#0B1220] to-[#0A0F1C] shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-3 px-6 pt-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10">
            <AlertTriangle className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Before You Start
            </h2>
            <p className="mt-1 text-sm text-mutedText">
              Please review these important guidelines
            </p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-6 space-y-3 px-6">
          <Guideline
            icon={<Camera />}
            title="Ensure your camera is turned ON"
            desc="We need to see you for a realistic interview experience"
          />
          <Guideline
            icon={<Mic />}
            title="Allow microphone access"
            desc="Required to record your verbal responses"
          />
          <Guideline
            icon={<Sparkles />}
            title="Sit in a quiet, well-lit environment"
            desc="Minimize background noise and ensure good lighting"
          />
          <Guideline
            icon={<Clock />}
            title="Answer clearly and concisely"
            desc="Take your time and speak naturally"
          />
          <Guideline
            icon={<Circle />}
            title='Click "Start Recording Answer" to begin'
            desc="You can pause or repeat a question anytime"
          />
        </div>

        {/* Recording Notice */}
        <div className="mx-6 mt-5 rounded-lg border border-warningBorder bg-warningBg px-4 py-3">
          <p className="text-sm leading-relaxed text-orange-300">
            <span className="font-semibold text-accent">Recording Notice:</span>{" "}
            Your interview responses (audio/video) will be recorded and analyzed
            by AI to generate your performance report. Your data is processed
            securely and used only for interview analysis.
          </p>
        </div>

        {/* Consent */}
        <div className="mt-4 flex items-center gap-3 px-6">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <p className="text-sm text-mutedText">
            I understand and consent to the recording and AI analysis of my
            interview responses
          </p>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 pt-5">
          <button
            disabled={!consent}
            onClick={() => navigate("/interview")}
            className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition
    ${
      consent
        ? "bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        : "bg-gray-500 text-gray-600 cursor-not-allowed"
    }`}
          >
            {consent
              ? "Start Interview"
              : "Please accept the consent to continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

function Guideline({ icon, title, desc }: GuidelineProps) {
  return (
    <div className="flex gap-3 rounded-lg border border-panelBorder bg-panel px-4 py-3">
      <div className="mt-1 text-sky-400">{icon}</div>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-0.5 text-xs text-mutedText">{desc}</p>
      </div>
    </div>
  );
}

export default Popup;
