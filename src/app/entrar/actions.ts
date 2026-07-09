"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; info?: string } | null;

function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Correo o contraseña incorrectos.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Ese correo ya tiene una cuenta. Inicia sesión.";
  if (m.includes("password") && m.includes("6"))
    return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("email") && m.includes("invalid"))
    return "El correo no es válido.";
  return "Algo salió mal. Inténtalo de nuevo.";
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Escribe tu correo y contraseña." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: translateAuthError(error.message) };

  redirect("/perfil");
}

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const zone = String(formData.get("zone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!fullName) return { error: "Escribe tu nombre." };
  if (!email || !password) return { error: "Escribe tu correo y contraseña." };
  if (password.length < 6)
    return { error: "La contraseña debe tener al menos 6 caracteres." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return { error: translateAuthError(error.message) };

  // With email confirmation off, signUp returns a session immediately. Save the
  // extra profile fields the signup trigger doesn't set, then go to the profile.
  if (data.session && data.user) {
    await supabase
      .from("profiles")
      .update({ phone: phone || null, zone: zone || null })
      .eq("auth_user_id", data.user.id);
    redirect("/perfil");
  }

  return {
    info: "Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.",
  };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
