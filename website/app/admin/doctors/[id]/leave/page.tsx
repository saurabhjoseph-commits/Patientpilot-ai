import { redirect } from "next/navigation";
export default async function LeavePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ clinicId?: string }> }) { const id = (await params).id; const clinicId = (await searchParams).clinicId; redirect(`/admin/doctors/${id}/schedule${clinicId ? `?clinicId=${encodeURIComponent(clinicId)}` : ""}`); }
