"use client";

import { useSession } from "next-auth/react";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { LoaderCircle, Save, UserRound } from "lucide-react";
import apiServices from "@/services/apiServices";

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage("");
    if (!session?.user.token) { setError("Please sign in again to update your account."); return; }
    const data = new FormData(event.currentTarget);
    const values = { name: String(data.get("name")).trim(), email: String(data.get("email")).trim(), phone: String(data.get("phone")).trim() };
    setBusy(true);
    try {
      await apiServices.updateMyProfile(values, session.user.token);
      await update({ user: values });
      setMessage("Your account details have been updated.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update your account details."); }
    finally { setBusy(false); }
  }

  return <main className="mx-auto min-h-[55vh] w-full max-w-2xl px-4 py-10 sm:px-8 sm:py-14"><section className="rounded-3xl border bg-white p-6 shadow-sm sm:p-9"><div className="flex size-12 items-center justify-center rounded-2xl bg-[#edf2e5] text-[#557344]"><UserRound/></div><p className="mt-6 text-xs font-semibold tracking-[.18em] text-[#718361]">YOUR DETAILS</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">My account</h1><p className="mt-3 text-sm text-muted-foreground">Keep your contact details up to date.</p>{status === "loading" ? <p className="mt-7">Loading account…</p> : <form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-medium">Name<input required minLength={2} name="name" defaultValue={session?.user.name ?? ""} autoComplete="name" className="mt-2 h-12 w-full rounded-xl border px-4 outline-none focus:border-[#67834e]"/></label><label className="block text-sm font-medium">Email address<input required type="email" name="email" defaultValue={session?.user.email ?? ""} autoComplete="email" className="mt-2 h-12 w-full rounded-xl border px-4 outline-none focus:border-[#67834e]"/></label><label className="block text-sm font-medium">Phone number<input required type="tel" minLength={10} name="phone" defaultValue={session?.user.phone ?? ""} autoComplete="tel" className="mt-2 h-12 w-full rounded-xl border px-4 outline-none focus:border-[#67834e]"/></label>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-800">{message}</p>}<button disabled={busy || !session?.user.token} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#243b2e] text-sm font-semibold text-white disabled:opacity-60">{busy ? <LoaderCircle size={17} className="animate-spin"/> : <Save size={17}/>}Save account details</button></form>}<div className="mt-6 flex flex-wrap gap-4 border-t pt-5 text-sm"><Link href="/auth/change-password" className="font-medium text-[#4f693d] hover:underline">Change password</Link><Link href="/allorders" className="font-medium text-[#4f693d] hover:underline">My orders</Link></div></section></main>;
}
