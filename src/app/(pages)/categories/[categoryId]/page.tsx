import { ProductCard } from "@/components/product/ProductCard";
import apiServices from "@/services/apiServices";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CategoryDetails({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  const [categoryResult, productsResult, subcategoriesResult] = await Promise.allSettled([
    apiServices.getCategory(categoryId),
    apiServices.getProductsBy({ category: categoryId }),
    apiServices.getSubcategoriesByCategory(categoryId),
  ]);
  if (categoryResult.status === "rejected") notFound();
  const category = categoryResult.value.data;
  const products = productsResult.status === "fulfilled" ? productsResult.value.data : [];
  const subcategories = subcategoriesResult.status === "fulfilled" ? subcategoriesResult.value.data : [];
  return <main className="container min-h-[55vh] px-5 py-10 sm:px-8 lg:px-12"><p className="text-xs font-semibold tracking-[.18em] text-[#718361]">CATEGORY</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">{category.name}</h1><p className="mt-3 text-sm text-muted-foreground">Explore products in the {category.name} collection.</p>{subcategories.length > 0 && <section className="mt-7"><h2 className="text-lg font-semibold">Shop by subcategory</h2><div className="mt-3 flex flex-wrap gap-2">{subcategories.map((subcategory)=><Link key={subcategory._id} href={`/subcategories/${subcategory._id}`} className="rounded-full border bg-white px-4 py-2 text-sm hover:border-[#a7bf8a] hover:text-[#4f693d]">{subcategory.name}</Link>)}</div></section>}{products.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product)=><ProductCard key={product._id} {...product}/>)}</div> : <p className="mt-8 rounded-2xl border p-6 text-muted-foreground">No products found in this category.</p>}</main>;
}
