import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/utils";
import apiServices from "@/services/apiServices";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");
  if (session.user.role?.toLowerCase() !== "admin") notFound();
  const result = await apiServices.getAllOrders(session.user.token).then((orders) => ({ orders })).catch((error: Error) => ({ error }));
  const orders = "orders" in result ? result.orders : null;

  return <main className="mx-auto min-h-[55vh] max-w-5xl space-y-6 px-4 py-8 sm:px-8 sm:py-12"><header><p className="text-xs font-semibold tracking-[.16em] text-[#718361]">STORE MANAGEMENT</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">All orders</h1></header>{!orders ? <Card role="alert"><CardContent className="py-5">Could not load orders. Check that your account has admin access, then try again.</CardContent></Card> : orders.length === 0 ? <Card><CardContent className="py-6 text-muted-foreground">There are no orders yet.</CardContent></Card> : <div className="space-y-3">{orders.toSorted((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt)).map((order)=><Card key={order._id}><CardHeader className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-semibold">Order #{order.id}</h2><p className="mt-1 text-sm text-muted-foreground">{formatDate(order.createdAt)}</p></div><div className="flex flex-wrap items-center gap-3"><Badge variant={order.isPaid ? "default" : "secondary"}>{order.isPaid ? "Paid" : "Unpaid"}</Badge><span className="font-semibold">{formatPrice(order.totalOrderPrice)}</span><Link href={`/allorders/${order._id}`} className="text-sm font-medium underline underline-offset-4">Details</Link></div></CardHeader></Card>)}</div>}</main>;
}
