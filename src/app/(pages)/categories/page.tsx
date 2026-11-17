import Image from "next/image";
import Link from "next/link";
import apiServices from "@/services/apiServices";

export default async function Categories() {
  const categories = await apiServices.getCategories().then(({ data }) => data).catch(() => []);
  return <main className="container min-h-[55vh] px-5 py-10 sm:px-8 lg:px-12"><p className="text-xs font-semibold tracking-[.18em] text-[#718361]">FIND YOUR THING</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Shop by category</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Browse the collection by the things you use every day.</p><Link href="/subcategories" className="mt-4 inline-block text-sm font-semibold text-[#4f693d] hover:underline">Browse all subcategories →</Link>{categories.length ? <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{categories.map((category) => <Link key={category._id} href={`/categories/${category._id}`} className="group overflow-hidden rounded-2xl border bg-white transition hover:border-[#a7bf8a] hover:shadow-sm"><div className="relative aspect-[4/3] bg-[#f3f5ef]">{category.image && <Image src={category.image} alt="" fill unoptimized sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform group-hover:scale-105"/>}</div><div className="p-4 font-semibold group-hover:text-[#557344]">{category.name}</div></Link>)}</div> : <p className="mt-8 rounded-2xl border p-6 text-muted-foreground">Categories are temporarily unavailable.</p>}</main>;
}
