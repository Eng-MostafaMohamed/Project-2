import { Card, CardContent } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import apiServices from "@/services/apiServices";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ keyword?: string }> }) {
  const { keyword = "" } = await searchParams;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");
  if (session.user.role?.toLowerCase() !== "admin") notFound();
  const result = await apiServices.getAllUsers(session.user.token, { keyword, limit: 50 }).then((users) => ({ users })).catch(() => ({ users: null }));

  return <main className="mx-auto min-h-[55vh] max-w-5xl space-y-6 px-4 py-8 sm:px-8 sm:py-12"><header><p className="text-xs font-semibold tracking-[.16em] text-[#718361]">STORE MANAGEMENT</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Customers</h1></header><form action="/admin/users" className="flex gap-3"><input name="keyword" defaultValue={keyword} placeholder="Search by name or email" className="h-11 min-w-0 flex-1 rounded-xl border bg-white px-4 text-sm"/><button className="rounded-xl bg-[#243b2e] px-5 text-sm font-semibold text-white">Search</button></form>{result.users === null ? <Card role="alert"><CardContent className="py-5">Could not load customers. Check that your account has admin access, then try again.</CardContent></Card> : result.users.length === 0 ? <Card><CardContent className="py-6 text-muted-foreground">No customers found.</CardContent></Card> : <div className="overflow-x-auto rounded-2xl border bg-white"><table className="w-full min-w-[600px] text-left text-sm"><thead className="border-b bg-muted/40 text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Email</th><th className="px-4 py-3 font-medium">Phone</th><th className="px-4 py-3 font-medium">Role</th></tr></thead><tbody className="divide-y">{result.users.map((user)=><tr key={user._id}><td className="px-4 py-3 font-medium">{user.name}</td><td className="px-4 py-3">{user.email}</td><td className="px-4 py-3">{user.phone || "—"}</td><td className="px-4 py-3 capitalize">{user.role}</td></tr>)}</tbody></table></div>}</main>;
}
