"use client";

import type { Review } from "@/types/response";
import apiServices from "@/services/apiServices";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LoaderCircle, Pencil, Star, Trash2 } from "lucide-react";

export default function ReviewSection({ productId, initialReviews, productName }: { productId?: string; initialReviews: Review[]; productName?: string }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  function reviewerId(item: Review) {
    return typeof item.user === "object" ? item.user?._id ?? item.user?.id : undefined;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = session?.user.token;
    if (!token || !productId) return;
    if (!review.trim()) { setError("Write a few words about this product."); return; }
    setPending(true); setError("");
    try {
      if (editingId) await apiServices.updateReview(editingId, { review: review.trim(), rating }, token);
      else await apiServices.createReview(productId, { review: review.trim(), rating }, token);
      setReviews(await apiServices.getReviewsForProduct(productId));
      setReview(""); setRating(5); setEditingId(null); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save your review."); }
    finally { setPending(false); }
  }

  async function removeReview(reviewId: string) {
    const token = session?.user.token;
    if (!token || pending) return;
    setPending(true); setError("");
    try { await apiServices.deleteReview(reviewId, token); setReviews((current) => current.filter((item) => item._id !== reviewId)); router.refresh(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not delete your review."); }
    finally { setPending(false); }
  }

  return <section aria-labelledby="reviews-heading" className="mt-12 border-t pt-8">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold tracking-[.16em] text-[#718361]">CUSTOMER FEEDBACK</p><h2 id="reviews-heading" className="mt-2 text-2xl font-semibold">Reviews {productName ? `for ${productName}` : ""}</h2></div><Link href="/reviews" className="text-sm font-medium text-[#4f693d] hover:underline">All reviews</Link></div>
    {productId && status === "authenticated" && <form onSubmit={submit} className="mt-6 space-y-3 rounded-2xl border bg-white p-5"><h3 className="font-semibold">{editingId ? "Edit your review" : "Write a review"}</h3><label className="block text-sm font-medium">Your rating<select value={rating} onChange={(event) => setRating(Number(event.target.value))} className="mt-2 h-11 w-full rounded-xl border bg-white px-3 sm:w-48">{[5,4,3,2,1].map((value)=><option key={value} value={value}>{value} {value === 1 ? "star" : "stars"}</option>)}</select></label><label className="block text-sm font-medium">Your review<textarea value={review} onChange={(event)=>setReview(event.target.value)} maxLength={1000} rows={4} className="mt-2 w-full rounded-xl border p-3 text-sm outline-none focus:border-[#67834e]" placeholder="What did you think of this product?"/></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<div className="flex flex-wrap gap-2"><button disabled={pending} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#243b2e] px-5 text-sm font-semibold text-white disabled:opacity-60">{pending && <LoaderCircle size={16} className="animate-spin"/>}{editingId ? "Save changes" : "Post review"}</button>{editingId && <button type="button" onClick={()=>{setEditingId(null);setReview("");setRating(5);setError("");}} className="h-11 rounded-xl border px-5 text-sm">Cancel</button>}</div></form>}
    {productId && status === "unauthenticated" && <p className="mt-5 rounded-xl border bg-white p-4 text-sm text-muted-foreground"><Link href="/auth/signin" className="font-semibold text-[#4f693d] hover:underline">Sign in</Link> to share your review.</p>}
    {error && !productId && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
    {reviews.length ? <ul className="mt-5 space-y-3">{reviews.map((item)=><li key={item._id} className="rounded-2xl border bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold">{typeof item.user === "object" ? item.user?.name || "Customer" : "Customer"}</p><div className="mt-1 flex items-center gap-1 text-amber-500" aria-label={`${item.rating} out of 5 stars`}>{Array.from({length:5},(_,index)=><Star key={index} size={14} className={index < item.rating ? "fill-current" : "text-neutral-300"}/>)}</div></div><div className="flex items-center gap-3">{item.createdAt && <time className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString("en-US")}</time>}{productId && session?.user.id && reviewerId(item) === session.user.id && <><button type="button" aria-label="Edit review" onClick={()=>{setEditingId(item._id);setReview(item.review);setRating(item.rating);}} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><Pencil size={16}/></button><button type="button" aria-label="Delete review" disabled={pending} onClick={()=>void removeReview(item._id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 size={16}/></button></>}</div></div><p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">{item.review}</p>{!productId && typeof item.product === "object" && item.product && <Link href={`/products/${item.product._id}`} className="mt-3 inline-block text-xs font-semibold text-[#4f693d] hover:underline">View product: {item.product.title}</Link>}</li>)}</ul> : <p className="mt-5 rounded-2xl border p-6 text-center text-sm text-muted-foreground">No reviews yet. Be the first to share your experience.</p>}
  </section>;
}
