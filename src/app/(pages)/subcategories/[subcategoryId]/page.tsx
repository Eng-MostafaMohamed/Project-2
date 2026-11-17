import { ProductCard } from "@/components/product/ProductCard";
import apiServices from "@/services/apiServices";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SubcategoryDetails({ params }: { params: Promise<{ subcategoryId: string }> }) {
  const { subcategoryId } = await params;
  const [subcategoryResult, productsResult] = await Promise.allSettled([
    apiServices.getSubcategory(subcategoryId), apiServices.getProductsBy({ subcategory: subcategoryId }),
  ]);
  if (subcategoryResult.status === "rejected") notFound();
  const subcategory = subcategoryResult.value.data;
  const products = productsResult.status === "fulfilled" ? productsResult.value.data : [];
  const category = typeof subcategory.category === "object" ? subcategory.category : null;
  return <main className="container min-h-[55vh] px-5 py-10 sm:px-8 lg:px-12">{category && <Link href={`/categories/${category._id}`} className="text-sm text-muted-foreground hover:underline">{category.name} /</Link>}<p className="mt-3 text-xs font-semibold tracking-[.18em] text-[#718361]">SUBCATEGORY</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">{subcategory.name}</h1><p className="mt-3 text-sm text-muted-foreground">Explore products in this subcategory.</p>{products.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product)=><ProductCard key={product._id} {...product}/>)}</div> : <p className="mt-8 rounded-2xl border p-6 text-muted-foreground">No products found in this subcategory.</p>}</main>;
}
