import { apiHandler, created } from "@/lib/core/api";
import { leadService } from "@/lib/leads/service";
import { after, NextResponse } from "next/server";
import { ClinicResolutionError, resolvePublicIntakeClinic } from "@/lib/clinic/clinic-scope";
import { deliverDemoRequestEmail, enqueueDemoRequestEmails } from "@/lib/leads/demo-request-email";

export const POST = apiHandler(async (request) => {
  const body = await request.json();

  let clinic;
  try {
    clinic = resolvePublicIntakeClinic();
  } catch (error) {
    if (error instanceof ClinicResolutionError) {
      return NextResponse.json({ message: "Demo booking is temporarily unavailable." }, { status: 503 });
    }
    throw error;
  }

  const lead = await leadService.bookDemo(body, clinic);
  let deliveryIds: readonly string[] = [];
  try { deliveryIds = await enqueueDemoRequestEmails(lead, clinic); } catch { /* The saved enquiry remains authoritative even if the outbox is unavailable. */ }
  if (deliveryIds.length) after(async () => { await Promise.allSettled(deliveryIds.map((id) => deliverDemoRequestEmail(id))); });

  return created(
    lead,
    "Your demo request has been received."
  );
});
