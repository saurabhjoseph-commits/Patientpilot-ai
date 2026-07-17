import { apiHandler, created } from "@/lib/core/api";
import { leadService } from "@/lib/leads/service";

export const POST = apiHandler(async (request) => {
  const body = await request.json();

  const lead = await leadService.bookDemo(body);

  return created(
    lead,
    "Demo booked successfully!"
  );
});