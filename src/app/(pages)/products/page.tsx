import { ProductCard } from "@/components/product/ProductCard";
import apiServices from "@/services/apiServices";

export default async function Products({ searchParams }: { searchParams: Promise<{ keyword?: string; category?: string; brand?: string; sort?: string }> }) {
  const filters = await searchParams;
  const [productsResult, categoriesResult, brandsResult] = await Promise.allSettled([
    filters.category || filters.brand || filters.keyword || filters.sort ? apiServices.getProductsBy(filters) : apiServices.getProducts(),
    apiServices.getCategories(), apiServices.getBrands(),
  ]);
  const products = productsResult.status === "fulfilled" ? productsResult.value.data : [];
  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value.data : [];
  const brands = brandsResult.status === "fulfilled" ? brandsResult.value.data : [];

  return (
    <main className="container min-h-[55vh] px-5 py-10 sm:px-8 lg:px-12">
      <p className="text-xs font-semibold tracking-[.18em] text-[#718361]">THE TECHMART EDIT</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Explore products</h1>
      <form action="/products" className="mt-6 grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
        <input name="keyword" defaultValue={filters.keyword} placeholder="Search products" className="h-11 rounded-xl border px-4 text-sm outline-none focus:border-[#67834e]" />
        <select name="category" defaultValue={filters.category ?? ""} className="h-11 rounded-xl border bg-white px-3 text-sm"><option value="">All categories</option>{categories.map((category)=><option key={category._id} value={category._id}>{category.name}</option>)}</select>
        <select name="brand" defaultValue={filters.brand ?? ""} className="h-11 rounded-xl border bg-white px-3 text-sm"><option value="">All brands</option>{brands.map((brand)=><option key={brand._id} value={brand._id}>{brand.name}</option>)}</select>
        <select name="sort" defaultValue={filters.sort ?? ""} className="h-11 rounded-xl border bg-white px-3 text-sm"><option value="">Recommended</option><option value="price">Price: low to high</option><option value="-price">Price: high to low</option><option value="-ratingsAverage">Top rated</option></select>
        <button className="h-11 rounded-xl bg-[#243b2e] px-5 text-sm font-semibold text-white">Filter</button>
      </form>
      <p className="mb-4 mt-6 text-sm text-muted-foreground">{products.length} products</p>
      {products.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard {...product} key={product._id} />
        ))}
      </div> : <p className="rounded-2xl border p-8 text-center text-muted-foreground">No matching products. Try changing your filters.</p>}
    </main>
  );
}
