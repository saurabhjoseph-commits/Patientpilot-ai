import CRMCard from "./CRMCard";
import { PhoneCall } from "lucide-react";

export default function CallHistory() {
  return (
    <CRMCard title="Call History">
      <div className="py-8 text-center">
        <PhoneCall
          size={42}
          className="mx-auto mb-4 text-gray-300"
        />

        <p className="font-medium text-gray-700">
          No calls yet
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Twilio call logs and AI conversation
          transcripts will appear here.
        </p>
      </div>
    </CRMCard>
  );
}