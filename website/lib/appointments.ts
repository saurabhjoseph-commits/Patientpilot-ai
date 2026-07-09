export async function saveAppointment() {
  const response = await fetch("/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      patientName: "John Smith",
      phone: "5551234567",
      email: "john@test.com",
      service: "Dental Cleaning",
      appointmentDate: "Thursday",
      appointmentTime: "2:00 PM",
      notes: "Booked from AI Receptionist Demo",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save appointment");
  }

  return response.json();
}