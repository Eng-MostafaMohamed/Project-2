"use client";

import apiServices from "@/services/apiServices";
import type { ProductI } from "@/interfaces/product";
import { useSession } from "next-auth/react";
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

export const wishlistContext = createContext<{ ids: Set<string>; products: ProductI[]; loading: boolean; toggle: (productId: string) => Promise<void> }>({ ids: new Set(), products: [], loading: false, toggle: async () => {} });

export default function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const token = session?.user.token;
  const [wishlist, setWishlist] = useState<{ token: string; products: ProductI[] }>();

  useEffect(() => {
    if (!token) return;
    let active = true;
    apiServices.getWishlist(token).then((products) => {
      if (active) setWishlist({ token, products });
    }).catch(() => {});
    return () => { active = false; };
  }, [token]);

  const toggle = useCallback(async (productId: string) => {
    if (!token) {
      if (status === "unauthenticated") router.push("/auth/signin");
      else toast.add({ title: "Sign in to save your favorites.", type: "error" });
      return;
    }
    const current = wishlist?.token === token ? wishlist.products : [];
    const removing = current.some((product) => product._id === productId);
    try {
      if (removing) await apiServices.removeFromWishlist(productId, token);
      else await apiServices.addToWishlist(productId, token);
      if (removing) setWishlist({ token, products: current.filter((product) => product._id !== productId) });
      else {
        const result = await apiServices.getWishlist(token);
        setWishlist({ token, products: result });
      }
      toast.add({ title: removing ? "Removed from wishlist" : "Added to wishlist", type: "success" });
    } catch (cause) {
      toast.add({ title: cause instanceof Error ? cause.message : "Could not update your wishlist.", type: "error" });
    }
  }, [router, status, token, wishlist]);

  const products = useMemo(() => token && wishlist?.token === token ? wishlist.products : [], [token, wishlist]);
  const ids = useMemo(() => new Set(products.map(({ _id }) => _id)), [products]);
  return <wishlistContext.Provider value={{ ids, products, loading: !!token && wishlist?.token !== token, toggle }}>{children}</wishlistContext.Provider>;
}
