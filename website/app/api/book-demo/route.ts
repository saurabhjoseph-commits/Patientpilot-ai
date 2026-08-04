import { apiHandler, created } from "@/lib/core/api";
import { leadService } from "@/lib/leads/service";
import { NextResponse } from "next/server";
import { ClinicResolutionError, resolvePublicIntakeClinic } from "@/lib/clinic/clinic-scope";

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

  return created(
    lead,
    "Demo booked successfully!"
  );
});
