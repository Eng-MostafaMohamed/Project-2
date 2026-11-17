import Link from "next/link";
import apiServices from "@/services/apiServices";

export default async function Subcategories() {
  const items = await apiServices.getSubcategories().then(({ data }) => data).catch(() => []);
  return <main className="container min-h-[55vh] px-5 py-10 sm:px-8 lg:px-12"><p className="text-xs font-semibold tracking-[.18em] text-[#718361]">EXPLORE THE DETAILS</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Subcategories</h1><p className="mt-3 text-sm text-muted-foreground">Find the right product by narrowing down a category.</p>{items.length ? <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map((item)=><Link key={item._id} href={`/subcategories/${item._id}`} className="rounded-2xl border bg-white p-5 transition hover:border-[#a7bf8a] hover:shadow-sm"><h2 className="font-semibold">{item.name}</h2><p className="mt-1 text-sm text-muted-foreground">Browse products in this subcategory</p></Link>)}</div> : <p className="mt-8 rounded-2xl border p-6 text-muted-foreground">Subcategories are temporarily unavailable.</p>}</main>;
}
