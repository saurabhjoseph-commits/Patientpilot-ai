import { NextResponse, type NextRequest } from "next/server";

import { validateNewPassword } from "@/lib/auth/password-recovery";
import { IUserCredentialRepository } from "@/lib/application/interfaces/IUserCredentialRepository";
import { IUserRepository } from "@/lib/application/interfaces/IUserRepository";
import { bootstrapInfrastructure } from "@/lib/infrastructure/dependency-injection/bootstrap";
import { serviceRegistry } from "@/lib/infrastructure/dependency-injection/ServiceRegistry";
import { PasswordHasher } from "@/lib/infrastructure/identity/PasswordHasher";
import { PasswordHash } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const accessToken = body && typeof body === "object" && typeof (body as { accessToken?: unknown }).accessToken === "string"
    ? (body as { accessToken: string }).accessToken
    : "";
  const password = body && typeof body === "object" && typeof (body as { password?: unknown }).password === "string"
    ? (body as { password: string }).password
    : "";

  if (!accessToken || validateNewPassword(password)) {
    return NextResponse.json({ error: "Unable to complete password reset." }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseServer.auth.getUser(accessToken);
    if (error || !data.user.email) {
      return NextResponse.json({ error: "Unable to complete password reset." }, { status: 401 });
    }

    bootstrapInfrastructure();
    const users = serviceRegistry.resolve<IUserRepository>("UserRepository");
    const credentials = serviceRegistry.resolve<IUserCredentialRepository>("UserCredentialRepository");
    const user = await users.findByEmail(data.user.email);
    if (!user) {
      return NextResponse.json({ error: "Unable to complete password reset." }, { status: 403 });
    }

    const credential = await credentials.findByUserId(user.id);
    if (!credential) {
      return NextResponse.json({ error: "Unable to complete password reset." }, { status: 403 });
    }

    const hash = await new PasswordHasher().hash(password);
    credential.changePassword(PasswordHash.create(hash));
    await credentials.update(credential);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to complete password reset." }, { status: 500 });
  }
}
