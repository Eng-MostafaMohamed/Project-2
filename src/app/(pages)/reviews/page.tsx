import ReviewSection from "@/components/reviews/ReviewSection";
import apiServices from "@/services/apiServices";

export default async function ReviewsPage() {
  const reviews = await apiServices.getAllReviews().catch(() => []);
  return <main className="container min-h-[55vh] px-5 py-10 sm:px-8 lg:px-12"><p className="text-xs font-semibold tracking-[.18em] text-[#718361]">REAL CUSTOMER FEEDBACK</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">All reviews</h1><p className="mt-3 text-sm text-muted-foreground">See what customers think about products across the store.</p><ReviewSection initialReviews={reviews}/></main>;
}
