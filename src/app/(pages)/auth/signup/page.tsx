"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, CircleAlert, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, Phone, ShieldCheck, UserRound, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import apiServices from "@/services/apiServices";

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().min(1, "Please enter your email address.").email("Please enter a valid email address."),
  phone: z.string().trim().min(10, "Please enter a valid phone number."),
  password: z.string().min(6, "Your password must be at least 6 characters."),
  rePassword: z.string().min(1, "Please confirm your password."),
  terms: z.boolean().refine((accepted) => accepted, "Please accept the terms to continue."),
}).refine((values) => values.password === values.rePassword, {
  message: "Passwords do not match.",
  path: ["rePassword"],
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [created, setCreated] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", rePassword: "", terms: false },
    mode: "onTouched",
  });

  async function onSubmit(values: SignUpValues) {
    try {
      await apiServices.signup({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        password: values.password,
        rePassword: values.rePassword,
      });
      setCreated(true);
    } catch (error) {
      setError("root", { message: error instanceof Error ? error.message : "Could not create your account. Please try again." });
    }
  }

  const inputClass = "h-12 w-full rounded-xl border border-[#dfe4da] bg-[#fafbf8] pr-11 pl-11 text-sm text-[#20332a] outline-none transition placeholder:text-[#92998d] hover:border-[#b7c4ac] focus:border-[#67834e] focus:bg-white focus:ring-4 focus:ring-[#dce9ca]/60 aria-invalid:border-red-400 aria-invalid:focus:ring-red-100 disabled:opacity-60";

  return (
    <main className="bg-[#fafaf8] px-4 py-8 text-[#20332a] sm:px-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-[#697461] transition hover:text-[#20332a] focus-visible:outline-2 focus-visible:outline-offset-4">
          <ArrowLeft size={15} /> Back to the good stuff
        </Link>
        <div className="grid overflow-hidden rounded-[28px] border border-[#e3e7dd] bg-white shadow-[0_20px_80px_-30px_#20332a25] lg:grid-cols-[1fr_1fr]">
          <section aria-labelledby="welcome-title" className="relative flex flex-col overflow-hidden bg-[#e8efdc] p-7 sm:p-10 lg:p-12">
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-[#526747]"><span className="flex size-6 items-center justify-center rounded-full bg-[#d4e4bb]"><Zap size={12} fill="currentColor" /></span>YOUR EVERYDAY, UPGRADED</div>
            <h1 id="welcome-title" className="mt-7 text-4xl leading-[1.1] font-semibold tracking-[-0.055em] sm:text-5xl">A good choice<br />starts <span className="font-serif font-normal italic text-[#657e50]">here.</span></h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#64705b]">Create your TechMart account and keep your favorite finds, orders, and everyday upgrades in one place.</p>
            <div className="mt-9 space-y-5">
              {["A smoother checkout, every time", "Your orders in one easy place", "A more personal shopping experience"].map((item) => <div key={item} className="flex items-center gap-3 text-sm font-medium"><span className="flex size-8 items-center justify-center rounded-full bg-[#d4e4bb] text-[#567044]"><ShieldCheck size={17} /></span>{item}</div>)}
            </div>
            <div className="mt-10 flex items-center gap-3 border-t border-[#cbd7bd] pt-5 sm:mt-auto"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#dbe7cb] text-[#567044]"><Zap size={19} /></span><div><p className="text-xs font-semibold">Good tech. Thoughtfully chosen.</p><p className="mt-1 text-[11px] text-[#64705b]">Find something that makes your day better.</p></div></div>
          </section>

          <section aria-labelledby="signup-title" className="flex flex-col justify-center px-6 py-9 sm:px-12 sm:py-12 lg:px-14">
            <div className="mb-6 flex size-12 items-center justify-center rounded-2xl border border-[#e4e9dc] bg-[#f3f6ed] text-[#5a7546]"><UserRound size={22} strokeWidth={1.5} /></div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#718361]">YOUR NEXT FAVORITE FIND</p>
            <h2 id="signup-title" className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Create your account</h2>
            <p className="mt-3 text-sm leading-6 text-[#7a8274]">A few details and you’re ready to go.</p>

            {created ? (
              <div className="mt-8 rounded-2xl border border-[#dce9ca] bg-[#f3f8eb] p-5" role="status">
                <h3 className="font-semibold">Your account is ready</h3>
                <p className="mt-2 text-sm leading-6 text-[#64705b]">Sign in with your new email and password to start shopping.</p>
                <button type="button" onClick={() => router.push("/auth/signin")} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#243b2e] text-sm font-semibold text-white transition hover:bg-[#36533c]">Go to sign in <ArrowRight size={16} /></button>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" aria-busy={isSubmitting}>
                <Field label="Full name" id="name" error={errors.name?.message} icon={<UserRound size={17} />}><input {...register("name")} id="name" autoComplete="name" placeholder="Your name" disabled={isSubmitting} aria-invalid={!!errors.name} className={inputClass} /></Field>
                <Field label="Email address" id="email" error={errors.email?.message} icon={<Mail size={17} />}><input {...register("email")} id="email" type="email" autoComplete="email" placeholder="you@example.com" disabled={isSubmitting} aria-invalid={!!errors.email} className={inputClass} /></Field>
                <Field label="Phone number" id="phone" error={errors.phone?.message} icon={<Phone size={17} />}><input {...register("phone")} id="phone" type="tel" autoComplete="tel" placeholder="01xxxxxxxxx" disabled={isSubmitting} aria-invalid={!!errors.phone} className={inputClass} /></Field>
                <Field label="Password" id="password" error={errors.password?.message} icon={<LockKeyhole size={17} />}><div className="relative"><input {...register("password")} id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="At least 6 characters" disabled={isSubmitting} aria-invalid={!!errors.password} className={inputClass} /><PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} /></div></Field>
                <Field label="Confirm password" id="rePassword" error={errors.rePassword?.message} icon={<LockKeyhole size={17} />}><div className="relative"><input {...register("rePassword")} id="rePassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Enter your password again" disabled={isSubmitting} aria-invalid={!!errors.rePassword} className={inputClass} /><PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} /></div></Field>
                <label className="flex items-start gap-2 pt-1 text-xs leading-5 text-[#697461]"><input {...register("terms")} type="checkbox" disabled={isSubmitting} className="mt-1 accent-[#63893d]" /> <span>I agree to the Terms of Service and Privacy Policy.</span></label>
                {errors.terms && <p role="alert" className="text-xs text-red-600">{errors.terms.message}</p>}
                {errors.root && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-xs leading-5 text-red-700"><CircleAlert size={16} className="mt-0.5 shrink-0" />{errors.root.message}</div>}
                <button type="submit" disabled={isSubmitting} className="group flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#243b2e] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#36533c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#67834e] disabled:cursor-wait disabled:opacity-70">
                  {isSubmitting ? <><LoaderCircle size={18} className="motion-safe:animate-spin" /> Creating your account…</> : <>Create my account <ArrowRight size={17} className="transition-transform motion-safe:group-hover:translate-x-1" /></>}
                </button>
              </form>
            )}
            <p className="mt-7 border-t border-[#e7eadf] pt-6 text-center text-xs text-[#7a8274]">Already have an account? <Link href="/auth/signin" className="font-semibold text-[#4f693d] underline-offset-4 hover:underline">Sign in</Link></p>
          </section>
        </div>
        <p className="mt-6 text-center text-[11px] tracking-wide text-[#8c9484]">Good tech. Thoughtfully chosen. Always TechMart.</p>
      </div>
    </main>
  );
}

function Field({ label, id, error, icon, children }: { label: string; id: string; error?: string; icon: ReactNode; children: ReactNode }) {
  return <div><label htmlFor={id} className="mb-1.5 block text-xs font-semibold">{label}</label><div className="relative">{<span aria-hidden="true" className="pointer-events-none absolute top-[15px] left-4 text-[#8a957e]">{icon}</span>}{children}</div>{error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-600">{error}</p>}</div>;
}

function PasswordToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return <button type="button" onClick={onToggle} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} className="absolute top-1 right-1 flex size-10 items-center justify-center rounded-lg text-[#7a8770] transition hover:bg-[#edf2e5] focus-visible:outline-2 focus-visible:outline-[#67834e]">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>;
}
