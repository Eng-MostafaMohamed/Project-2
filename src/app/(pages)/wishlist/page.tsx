"use client";

import Link from "next/link";
import { Heart, LoaderCircle } from "lucide-react";
import { useContext } from "react";
import { wishlistContext } from "@/contexts/wishlistContext";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { products, loading } = useContext(wishlistContext);
  return <main className="container min-h-[55vh] px-5 py-10 sm:px-8 lg:px-12"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-full bg-rose-50 text-rose-500"><Heart/></span><div><p className="text-xs font-semibold tracking-[.18em] text-[#718361]">SAVED FOR LATER</p><h1 className="text-3xl font-semibold tracking-tight">My wishlist</h1></div></div>{loading ? <p role="status" className="mt-10 flex items-center gap-2 text-muted-foreground"><LoaderCircle className="animate-spin" size={18}/>Loading your favorites…</p> : products.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product)=><ProductCard key={product._id} {...product}/>)}</div> : <div className="mt-8 rounded-3xl border p-10 text-center"><p className="text-lg font-semibold">Your wishlist is empty</p><p className="mt-2 text-sm text-muted-foreground">Tap the heart on any product to save it here.</p><Link href="/products" className="mt-5 inline-flex rounded-full bg-[#243b2e] px-6 py-3 text-sm font-semibold text-white">Explore products</Link></div>}</main>;
}
