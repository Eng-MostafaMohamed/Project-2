import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/utils";
import apiServices from "@/services/apiServices";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function OrderDetails({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/auth/signin?callbackUrl=${encodeURIComponent(`/allorders/${orderId}`)}`);
  if (!session.user.token) redirect(`/auth/signin?callbackUrl=${encodeURIComponent(`/allorders/${orderId}`)}`);
  const order = await apiServices.getOrder(orderId, session.user.token).catch(() => null);
  if (!order) notFound();

  return <main className="mx-auto min-h-[55vh] max-w-4xl space-y-6 px-4 py-8 sm:px-6 sm:py-12"><Link href="/allorders" className="text-sm text-muted-foreground hover:underline">← Back to my orders</Link><Card><CardHeader className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-semibold">Order #{order.id}</h1><CardDescription>Placed on {formatDate(order.createdAt)}</CardDescription></div><div className="flex gap-2"><Badge variant={order.isPaid ? "default" : "secondary"}>{order.isPaid ? "Paid" : "Unpaid"}</Badge><Badge variant={order.isDelivered ? "default" : "secondary"}>{order.isDelivered ? "Delivered" : "Awaiting delivery"}</Badge></div></CardHeader><CardContent className="space-y-6"><section><h2 className="mb-3 font-semibold">Items</h2><ul className="divide-y border-y">{order.cartItems.map((item)=><li key={item._id} className="flex justify-between gap-4 py-4"><div><p className="font-medium">{item.product?.title ?? "Unavailable product"}</p><p className="text-sm text-muted-foreground">Quantity {item.count}</p></div><p className="font-semibold">{formatPrice(item.price * item.count)}</p></li>)}</ul><p className="mt-4 text-right text-lg font-semibold">Total {formatPrice(order.totalOrderPrice)}</p></section><div className="grid gap-5 sm:grid-cols-2"><section><h2 className="font-semibold">Payment</h2><p className="mt-1 capitalize text-sm text-muted-foreground">{order.paymentMethodType}</p></section>{order.shippingAddress && <section><h2 className="font-semibold">Shipping address</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{order.shippingAddress.details}<br/>{order.shippingAddress.city}<br/>{order.shippingAddress.phone}</p></section>}</div></CardContent></Card></main>;
}
