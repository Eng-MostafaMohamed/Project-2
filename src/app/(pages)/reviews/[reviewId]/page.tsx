import Link from "next/link";
import apiServices from "@/services/apiServices";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";

export default async function ReviewDetails({ params }: { params: Promise<{ reviewId: string }> }) {
  const { reviewId } = await params;
  const review = await apiServices.getReview(reviewId).catch(() => null);
  if (!review) notFound();
  const product = typeof review.product === "object" ? review.product : null;
  const user = typeof review.user === "object" ? review.user : null;
  return <main className="mx-auto min-h-[55vh] max-w-3xl px-5 py-10 sm:px-8"><Link href="/reviews" className="text-sm text-muted-foreground hover:underline">← All reviews</Link><article className="mt-6 rounded-3xl border bg-white p-6 sm:p-9"><p className="text-xs font-semibold tracking-[.16em] text-[#718361]">CUSTOMER REVIEW</p><h1 className="mt-2 text-3xl font-semibold">{product?.title ?? "Product review"}</h1><div className="mt-4 flex items-center gap-2"><span className="flex items-center gap-1 text-amber-500"><Star size={16} className="fill-current"/>{review.rating}/5</span><span className="text-sm text-muted-foreground">by {user?.name ?? "Customer"}</span></div><p className="mt-6 whitespace-pre-line text-base leading-7">{review.review}</p>{product && <Link href={`/products/${product._id}`} className="mt-7 inline-flex rounded-full bg-[#243b2e] px-5 py-3 text-sm font-semibold text-white">View product</Link>}</article></main>;
}
