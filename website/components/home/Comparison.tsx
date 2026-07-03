export default function Comparison() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Why PatientPilot AI?
          </span>

          <h2 className="mt-6 text-4xl font-bold">
            Traditional Receptionist vs PatientPilot AI
          </h2>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border shadow-lg">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-5 text-left">Traditional Receptionist</th>
                <th className="p-5 text-left">PatientPilot AI</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              <tr className="border-b">
                <td className="p-5">Works only during office hours</td>
                <td className="p-5">Available 24/7</td>
              </tr>

              <tr className="border-b">
                <td className="p-5">Misses calls after hours</td>
                <td className="p-5">Never misses a patient call</td>
              </tr>

              <tr className="border-b">
                <td className="p-5">Requires salary & benefits</td>
                <td className="p-5">Affordable monthly subscription</td>
              </tr>

              <tr className="border-b">
                <td className="p-5">Needs vacations & sick leave</td>
                <td className="p-5">Always available</td>
              </tr>

              <tr>
                <td className="p-5">Manual appointment scheduling</td>
                <td className="p-5">Automatic appointment booking</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}