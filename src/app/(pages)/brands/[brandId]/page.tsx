import { ProductCard } from "@/components/product/ProductCard";
import apiServices from "@/services/apiServices";
import { notFound } from "next/navigation";

export default async function BrandDetails({ params }: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await params;
  const [brandResult, productsResult] = await Promise.allSettled([apiServices.getBrand(brandId), apiServices.getProductsBy({ brand: brandId })]);
  if (brandResult.status === "rejected") notFound();
  const brand = brandResult.value.data;
  const products = productsResult.status === "fulfilled" ? productsResult.value.data : [];
  return <main className="container min-h-[55vh] px-5 py-10 sm:px-8 lg:px-12"><p className="text-xs font-semibold tracking-[.18em] text-[#718361]">BRAND COLLECTION</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">{brand.name}</h1><p className="mt-3 text-sm text-muted-foreground">Products from {brand.name}.</p>{products.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product)=><ProductCard key={product._id} {...product}/>)}</div> : <p className="mt-8 rounded-2xl border p-6 text-muted-foreground">No products found for this brand.</p>}</main>;
}
