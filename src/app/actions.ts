"use server";

import { signIn, signOut } from "@/auth";

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/hub" });
}

export async function loginDemo() {
  await signIn("demo", { redirectTo: "/hub" });
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
