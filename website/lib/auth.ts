import { supabaseBrowser } from "./supabase-browser";

export async function signUp(
  email: string,
  password: string
) {
  return await supabaseBrowser.auth.signUp({
    email,
    password,
  });
}

export async function signIn(
  email: string,
  password: string
) {
  return await supabaseBrowser.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabaseBrowser.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabaseBrowser.auth.getUser();

  return user;
}

export async function resetPassword(
  email: string
) {
  return await supabaseBrowser.auth.resetPasswordForEmail(
    email
  );
}