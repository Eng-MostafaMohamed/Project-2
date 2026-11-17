"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, KeyRound, LoaderCircle, Mail } from "lucide-react";
import apiServices from "@/services/apiServices";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "code" | "password" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      if (step === "email") { await apiServices.forgotPassword(email.trim()); setStep("code"); }
      else if (step === "code") { await apiServices.verifyResetCode(code.trim()); setStep("password"); }
      else if (step === "password") {
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        await apiServices.resetPassword(email.trim(), password); setStep("done");
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not complete the request."); }
    finally { setBusy(false); }
  }

  return <main className="mx-auto w-full max-w-lg px-4 py-10 sm:py-16"><Link href="/auth/signin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={16}/> Back to sign in</Link><section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm sm:p-9"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#edf2e5] text-[#557344]">{step === "email" ? <Mail/> : <KeyRound/>}</span><p className="mt-6 text-xs font-semibold tracking-[.18em] text-[#718361]">ACCOUNT RECOVERY</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{step === "email" ? "Forgot your password?" : step === "code" ? "Check your email" : step === "password" ? "Choose a new password" : "Password updated"}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{step === "email" ? "Enter your account email and we’ll send you a reset code." : step === "code" ? `Enter the reset code sent to ${email}.` : step === "password" ? "Set a new password for your account." : "You can now sign in using your new password."}</p>
    {step === "done" ? <Link href="/auth/signin" className="mt-7 flex h-12 items-center justify-center rounded-xl bg-[#243b2e] text-sm font-semibold text-white">Go to sign in</Link> : <form onSubmit={submit} className="mt-7 space-y-4">{step === "email" && <label className="block text-sm font-medium">Email address<input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete="email" className="mt-2 h-12 w-full rounded-xl border px-4 outline-none focus:border-[#67834e]" placeholder="you@example.com"/></label>}{step === "code" && <label className="block text-sm font-medium">Reset code<input required inputMode="numeric" value={code} onChange={(e)=>setCode(e.target.value)} className="mt-2 h-12 w-full rounded-xl border px-4 outline-none focus:border-[#67834e]" placeholder="Enter the code from your email"/></label>}{step === "password" && <><label className="block text-sm font-medium">New password<input required minLength={6} type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-2 h-12 w-full rounded-xl border px-4 outline-none focus:border-[#67834e]" autoComplete="new-password"/></label><label className="block text-sm font-medium">Confirm new password<input required minLength={6} type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className="mt-2 h-12 w-full rounded-xl border px-4 outline-none focus:border-[#67834e]" autoComplete="new-password"/></label></>}{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#243b2e] text-sm font-semibold text-white disabled:opacity-60">{busy ? <><LoaderCircle size={17} className="animate-spin"/>Please wait…</> : step === "email" ? "Send reset code" : step === "code" ? "Verify code" : "Reset password"}</button>{step === "code" && <button type="button" disabled={busy} onClick={async()=>{setError("");setBusy(true);try{await apiServices.forgotPassword(email.trim());}catch(cause){setError(cause instanceof Error?cause.message:"Could not resend the code.");}finally{setBusy(false);}}} className="w-full text-center text-sm font-medium text-[#4f693d]">Resend code</button>}</form>}</section></main>;
}
