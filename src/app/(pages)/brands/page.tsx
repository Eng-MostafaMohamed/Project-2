import Image from "next/image";
import Link from "next/link";
import apiServices from "@/services/apiServices";

export default async function Brands() {
  const brands = await apiServices.getBrands().then(({ data }) => data).catch(() => []);
  return <main className="container min-h-[55vh] px-5 py-10 sm:px-8 lg:px-12"><p className="text-xs font-semibold tracking-[.18em] text-[#718361]">NAMES TO KNOW</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Shop by brand</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Explore trusted names and find the technology that fits your day.</p>{brands.length ? <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{brands.map((brand) => <Link key={brand._id} href={`/brands/${brand._id}`} className="group flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border bg-white p-5 transition hover:border-[#a7bf8a] hover:shadow-sm"><div className="relative size-20 overflow-hidden rounded-full bg-[#f3f5ef]">{brand.image && <Image src={brand.image} alt="" fill unoptimized sizes="80px" className="object-contain p-2"/>}</div><span className="font-semibold group-hover:text-[#557344]">{brand.name}</span></Link>)}</div> : <p className="mt-8 rounded-2xl border p-6 text-muted-foreground">Brands are temporarily unavailable.</p>}</main>;
}
