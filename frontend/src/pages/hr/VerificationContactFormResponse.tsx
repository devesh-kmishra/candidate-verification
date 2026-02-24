import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface ClaimedEmployment {
  companyName: string;
  designation: string;
  startDate: string;
  endDate: string;
  salary: string;
  reportingManager: string;
}

interface VerificationResponseDTO {
  candidateName: string;
  candidateEmail: string;
  claimedEmployment: ClaimedEmployment;
}

const VerificationContactResponseForm = () => {
  const { responseToken } = useParams();
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [data, setData] = useState<VerificationResponseDTO | null>(null);
  const [isAccurate, setIsAccurate] = useState<boolean | null>(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 🔎 Validate Token + Fetch Claimed Data
  useEffect(() => {
    const fetchVerificationData = async () => {
      try {
        const res = await axios.get(
          `/api/public/verification-response/${responseToken}`,
        );
        setData(res.data);
      } catch (err: any) {
        setExpired(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationData();
  }, [responseToken]);

  // 📤 Submit Response
  const handleSubmit = async () => {
    if (isAccurate === null) {
      alert("Please select verification status");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post("/api/public/verification-response/submit", {
        token: responseToken,
        isAccurate,
        remarks,
      });

      setSubmitted(true);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------
  // UI STATES
  // ----------------------------

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Validating secure link...
      </div>
    );

  if (expired)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold text-red-600">
          This verification link has expired or is invalid.
        </h2>
      </div>
    );

  if (submitted)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          Thank you for your response!
        </h2>
        <p className="text-gray-600">
          Your verification has been successfully recorded.
        </p>
      </div>
    );

  // ----------------------------
  // MAIN FORM
  // ----------------------------

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6">
          Employment Verification Request
        </h2>

        <div className="mb-6 space-y-3 bg-gray-100 p-4 rounded-lg">
          <p>
            <strong>Candidate Name:</strong> {data?.candidateName}
          </p>
          <p>
            <strong>Email:</strong> {data?.candidateEmail}
          </p>
          <p>
            <strong>Company:</strong> {data?.claimedEmployment.companyName}
          </p>
          <p>
            <strong>Designation:</strong> {data?.claimedEmployment.designation}
          </p>
          <p>
            <strong>Start Date:</strong> {data?.claimedEmployment.startDate}
          </p>
          <p>
            <strong>End Date:</strong> {data?.claimedEmployment.endDate}
          </p>
          <p>
            <strong>Salary:</strong> {data?.claimedEmployment.salary}
          </p>
          <p>
            <strong>Reporting Manager:</strong>{" "}
            {data?.claimedEmployment.reportingManager}
          </p>
        </div>

        <div className="space-y-4">
          <label className="block font-medium">
            Is the above information accurate?
          </label>

          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setIsAccurate(true)}
              className={`px-6 py-2 rounded-lg border ${
                isAccurate === true ? "bg-green-600 text-white" : "bg-white"
              }`}
            >
              Yes – Correct
            </button>

            <button
              type="button"
              onClick={() => setIsAccurate(false)}
              className={`px-6 py-2 rounded-lg border ${
                isAccurate === false ? "bg-red-600 text-white" : "bg-white"
              }`}
            >
              No – Incorrect
            </button>
          </div>

          <div>
            <label className="block font-medium mt-4">Remarks (Optional)</label>
            <textarea
              className="w-full border rounded-lg p-3 mt-2"
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any clarification..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Verification"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationContactResponseForm;
