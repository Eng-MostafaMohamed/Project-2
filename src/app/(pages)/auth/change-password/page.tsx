"use client";

import { useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, LockKeyhole } from "lucide-react";
import apiServices from "@/services/apiServices";

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage("");
    if (password !== rePassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    const token = session?.user.token;
    if (!token) { setError("Please sign in again to change your password."); return; }
    setBusy(true);
    try { await apiServices.changePassword({ currentPassword, password, rePassword }, token); setMessage("Your password has been changed."); setCurrentPassword(""); setPassword(""); setRePassword(""); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not change your password."); }
    finally { setBusy(false); }
  }

  return <main className="mx-auto w-full max-w-lg px-4 py-10 sm:py-16"><Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={16}/> Back to shopping</Link><section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm sm:p-9"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#edf2e5] text-[#557344]"><LockKeyhole/></span><h1 className="mt-6 text-3xl font-semibold tracking-tight">Change password</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Enter your current password, then choose a new one.</p>{status === "loading" ? <p className="mt-7">Loading account…</p> : <form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-medium">Current password<input required type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} autoComplete="current-password" className="mt-2 h-12 w-full rounded-xl border px-4 outline-none focus:border-[#67834e]"/></label><label className="block text-sm font-medium">New password<input required minLength={6} type="password" value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete="new-password" className="mt-2 h-12 w-full rounded-xl border px-4 outline-none focus:border-[#67834e]"/></label><label className="block text-sm font-medium">Confirm new password<input required minLength={6} type="password" value={rePassword} onChange={(e)=>setRePassword(e.target.value)} autoComplete="new-password" className="mt-2 h-12 w-full rounded-xl border px-4 outline-none focus:border-[#67834e]"/></label>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-800">{message}</p>}<button disabled={busy || !session?.user.token} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#243b2e] text-sm font-semibold text-white disabled:opacity-60">{busy && <LoaderCircle size={17} className="animate-spin"/>}Update password</button></form>}</section></main>;
}
