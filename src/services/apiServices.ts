import type {
    AddressInput,
    AdminUser,
    Cart,
    CartResponse,
    CheckoutAddress,
    CheckoutResponse,
    Order,
    ProductDetailsResponse,
    ProductsResponse,
    SavedAddress,
    SignInResponse,
    VerifyTokenResponse,
} from "@/types/response";


class ApiServices {

    #jsonHeaders = { "content-type": "application/json" };

    #cartApiVersion(): "v1" | "v2" {
        return process.env.NEXT_PUBLIC_CART_API_VERSION === "v1" ? "v1" : "v2";
    }

    getCartApiVersion(): "v1" | "v2" {
        return this.#cartApiVersion();
    }

    async getProducts(): Promise<ProductsResponse> {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/products")
        const data = await response.json()

        return data;
    }

    async getProductsBy(query: { brand?: string; category?: string; subcategory?: string; keyword?: string; sort?: string }): Promise<ProductsResponse> {
        const params = new URLSearchParams(Object.entries(query).filter((entry): entry is [string, string] => !!entry[1]));
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/products?${params}`);
        if (!response.ok) throw new Error("Could not load products.");
        return response.json();
    }

    async getSubcategories(): Promise<{ data: import("@/interfaces/product").SubcategoryDetailsI[] }> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/subcategories`);
        if (!response.ok) throw new Error("Could not load subcategories.");
        return response.json();
    }

    async getSubcategory(id: string): Promise<{ data: import("@/interfaces/product").SubcategoryDetailsI }> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/subcategories/${encodeURIComponent(id)}`);
        if (!response.ok) throw new Error("Could not load this subcategory.");
        return response.json();
    }

    async getSubcategoriesByCategory(categoryId: string): Promise<{ data: import("@/interfaces/product").SubcategoryDetailsI[] }> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/categories/${encodeURIComponent(categoryId)}/subcategories`);
        if (!response.ok) throw new Error("Could not load this category's subcategories.");
        return response.json();
    }

    async getReviewsForProduct(productId: string): Promise<import("@/types/response").Review[]> {
        return this.#readReviews(`/api/v1/products/${encodeURIComponent(productId)}/reviews`);
    }

    async getAllReviews(): Promise<import("@/types/response").Review[]> {
        return this.#readReviews("/api/v1/reviews");
    }

    async getReview(reviewId: string): Promise<import("@/types/response").Review> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/reviews/${encodeURIComponent(reviewId)}`);
        const payload = await response.json().catch(() => null);
        if (!response.ok) throw new Error(payload?.message || "Could not load this review.");
        return (payload?.data?.review ?? payload?.data ?? payload) as import("@/types/response").Review;
    }

    async createReview(productId: string, values: { review: string; rating: number }, token: string): Promise<void> {
        await this.#writeReview("POST", `/api/v1/products/${encodeURIComponent(productId)}/reviews`, values, token);
    }

    async updateReview(reviewId: string, values: { review: string; rating: number }, token: string): Promise<void> {
        await this.#writeReview("PUT", `/api/v1/reviews/${encodeURIComponent(reviewId)}`, values, token);
    }

    async deleteReview(reviewId: string, token: string): Promise<void> {
        await this.#writeReview("DELETE", `/api/v1/reviews/${encodeURIComponent(reviewId)}`, undefined, token);
    }

    async #readReviews(path: string): Promise<import("@/types/response").Review[]> {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + path, { cache: "no-store" });
        const payload = await response.json().catch(() => null);
        if (!response.ok) throw new Error(payload?.message || "Could not load reviews.");
        const reviews = Array.isArray(payload?.data) ? payload.data : payload?.data?.reviews;
        return Array.isArray(reviews) ? reviews : [];
    }

    async #writeReview(method: "POST" | "PUT" | "DELETE", path: string, values: { review: string; rating: number } | undefined, token: string): Promise<void> {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + path, {
            method,
            headers: { ...this.#jsonHeaders, token },
            body: values ? JSON.stringify(values) : undefined,
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || payload?.statusMsg === "fail" || payload?.status === "fail") {
            throw new Error(payload?.message || "Could not update the review.");
        }
    }

    async getBrands(): Promise<{ data: import("@/interfaces/product").BrandI[] }> {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/brands");
        if (!response.ok) throw new Error("Could not load brands.");
        return response.json();
    }

    async getBrand(id: string): Promise<{ data: import("@/interfaces/product").BrandI }> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/brands/${encodeURIComponent(id)}`);
        if (!response.ok) throw new Error("Could not load this brand.");
        return response.json();
    }

    async getCategories(): Promise<{ data: import("@/interfaces/product").CategoryI[] }> {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/categories");
        if (!response.ok) throw new Error("Could not load categories.");
        return response.json();
    }

    async getCategory(id: string): Promise<{ data: import("@/interfaces/product").CategoryI }> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/categories/${encodeURIComponent(id)}`);
        if (!response.ok) throw new Error("Could not load this category.");
        return response.json();
    }


    async getProductDetails(productId: string): Promise<ProductDetailsResponse> {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/products/" + productId)
        const data = await response.json()

        return data;
    }


    async addProductToCart(productId: string, token: string): Promise<CartResponse> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${this.#cartApiVersion()}/cart`, {
            body: JSON.stringify({
                productId
            }),
            headers: { ...this.#jsonHeaders, token },
            method: "post"
        })

        return this.#readCartResponse(response);
    }

    async getUserCart(token: string): Promise<CartResponse | null> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${this.#cartApiVersion()}/cart`, {
            headers: { ...this.#jsonHeaders, token },
            cache: "no-store"
        })

        if (response.status === 404) {
            return null;
        }
        return this.#readCartResponse(response);
    }

    async removeProductFromCart(productId: string, token: string): Promise<CartResponse> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${this.#cartApiVersion()}/cart/${encodeURIComponent(productId)}`, {
            method: "delete",
            headers: { ...this.#jsonHeaders, token },
            cache: "no-store"
        })

        return this.#readCartResponse(response);
    }

    async clearCart(token: string): Promise<CartResponse> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${this.#cartApiVersion()}/cart`, {
            method: "delete",
            headers: { ...this.#jsonHeaders, token },
            cache: "no-store"
        })

        return this.#readCartResponse(response);
    }

    async applyCoupon(couponName: string, token: string): Promise<CartResponse> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/cart/applyCoupon`, {
            method: "PUT",
            headers: { ...this.#jsonHeaders, token },
            body: JSON.stringify({ couponName }),
        });
        return this.#readCartResponse(response);
    }

    async updateProductCount(productId: string, count: number, token: string): Promise<CartResponse> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${this.#cartApiVersion()}/cart/${encodeURIComponent(productId)}`, {
            method: 'put',
            headers: { ...this.#jsonHeaders, token },
            body: JSON.stringify({
                count
            })

        })

        return this.#readCartResponse(response);
    }

    async #readCartResponse(response: Response): Promise<CartResponse> {
        const payload = await response.json().catch(() => null);
        if (!response.ok || payload?.statusMsg === "fail" || payload?.status === "fail") {
            throw new Error(payload?.message || "Could not load your cart.");
        }
        const rawCart = payload?.data?.cart ?? payload?.data ?? payload?.cart ?? {};
        const products = Array.isArray(rawCart.products) ? rawCart.products : [];
        const cart = {
            ...rawCart,
            products,
            totalCartPrice: rawCart.totalCartPrice ?? rawCart.totalPrice ?? 0,
        } as Cart;
        return {
            ...payload,
            cartId: payload?.cartId ?? cart._id ?? "",
            numOfCartItems: payload?.numOfCartItems ?? products.reduce((sum: number, item: { count?: number }) => sum + (item.count ?? 0), 0),
            data: cart,
        } as CartResponse;
    }


    async getUserAddresses(token: string, signal?: AbortSignal): Promise<SavedAddress[]> {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/addresses", {
            headers: { token },
            cache: "no-store",
            signal,
        });
        if (!response.ok) {
            throw new Error("Could not load your addresses.");
        }

        const result: { data: SavedAddress[] } = await response.json();
        if (!Array.isArray(result.data)) {
            throw new Error("Expected a list of addresses.");
        }
        return result.data;
    }

    async getAddressById(id: string, token: string): Promise<SavedAddress> {
        const path = "/api/v1/addresses/" + encodeURIComponent(id);
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + path, {
            headers: { token },
            cache: "no-store",
        });
        if (!response.ok) {
            throw new Error("Could not load the selected address.");
        }

        const { data }: { data: SavedAddress } = await response.json();
        if (
            typeof data?.details !== "string" || !data.details.trim() ||
            typeof data.city !== "string" || !data.city.trim() ||
            typeof data.phone !== "string" || !data.phone.trim()
        ) {
            throw new Error("The selected address is missing shipping details.");
        }
        return data;
    }

    async addAddress(address: AddressInput, token: string): Promise<void> {
        await this.#writeAddress("POST", token, undefined, address);
    }

    async updateAddress(id: string, address: AddressInput, token: string): Promise<void> {
        await this.#writeAddress("PUT", token, id, address);
    }

    async deleteAddress(id: string, token: string): Promise<void> {
        await this.#writeAddress("DELETE", token, id);
    }

    async #writeAddress(
        method: "POST" | "PUT" | "DELETE",
        token: string,
        id?: string,
        address?: AddressInput,
    ): Promise<void> {
        const path = "/api/v1/addresses" + (id ? "/" + encodeURIComponent(id) : "");
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + path, {
            method,
            headers: { ...this.#jsonHeaders, token },
            body: address ? JSON.stringify(address) : undefined,
        });
        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Could not update your saved addresses.");
        }
    }

    async checkout(cartId: string, address: CheckoutAddress, token: string, returnUrl = "http://localhost:3000"): Promise<CheckoutResponse> {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/v1/orders/checkout-session/${encodeURIComponent(cartId)}?url=${encodeURIComponent(returnUrl)}`, {
            method: "post",
            headers: { ...this.#jsonHeaders, token },
            body: JSON.stringify({ shippingAddress: address })
        })

        const data: CheckoutResponse = await response.json();
        if (!response.ok || !data.session?.url) {
            throw new Error("Could not start checkout");
        }
        return data;
    }

    async createCashOrder(cartId: string, address: CheckoutAddress, token: string): Promise<{ status?: string; message?: string; data?: { _id?: string } }> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${this.#cartApiVersion()}/orders/${encodeURIComponent(cartId)}`, {
            method: "post",
            headers: { ...this.#jsonHeaders, token },
            body: JSON.stringify({ shippingAddress: address }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok || data?.statusMsg === "fail" || data?.status === "fail") throw new Error(data?.message || "Could not place your order.");
        return data;
    }

    async getWishlist(token: string): Promise<import("@/interfaces/product").ProductI[]> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/wishlist`, { headers: { token }, cache: "no-store" });
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.message || "Could not load your wishlist.");
        return Array.isArray(data?.data) ? data.data : [];
    }

    async addToWishlist(productId: string, token: string): Promise<void> {
        await this.#wishlistRequest("POST", token, productId);
    }

    async removeFromWishlist(productId: string, token: string): Promise<void> {
        await this.#wishlistRequest("DELETE", token, productId);
    }

    async #wishlistRequest(method: "POST" | "DELETE", token: string, productId: string): Promise<void> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/wishlist${method === "DELETE" ? `/${encodeURIComponent(productId)}` : ""}`, {
            method,
            headers: { ...this.#jsonHeaders, token },
            body: method === "POST" ? JSON.stringify({ productId }) : undefined,
        });
        const data = await response.json().catch(() => null);
        if (!response.ok || data?.statusMsg === "fail" || data?.status === "fail") throw new Error(data?.message || "Could not update your wishlist.");
    }

    async forgotPassword(email: string): Promise<void> {
        await this.#authAction("POST", "/api/v1/auth/forgotPasswords", { email });
    }

    async verifyResetCode(resetCode: string): Promise<void> {
        await this.#authAction("POST", "/api/v1/auth/verifyResetCode", { resetCode });
    }

    async resetPassword(email: string, newPassword: string): Promise<void> {
        await this.#authAction("PUT", "/api/v1/auth/resetPassword", { email, newPassword });
    }

    async changePassword(values: { currentPassword: string; password: string; rePassword: string }, token: string): Promise<void> {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/users/changeMyPassword", {
            method: "PUT", headers: { ...this.#jsonHeaders, token }, body: JSON.stringify(values),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok || data?.statusMsg === "fail" || data?.status === "fail") throw new Error(data?.message || "Could not change your password.");
    }

    async updateMyProfile(values: { name: string; email: string; phone: string }, token: string): Promise<void> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/updateMe/`, {
            method: "PUT", headers: { ...this.#jsonHeaders, token }, body: JSON.stringify(values),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok || data?.statusMsg === "fail" || data?.status === "fail") {
            throw new Error(data?.message || "Could not update your account details.");
        }
    }

    async #authAction(method: "POST" | "PUT", path: string, body: object): Promise<void> {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + path, { method, headers: this.#jsonHeaders, body: JSON.stringify(body) });
        const data = await response.json().catch(() => null);
        if (!response.ok || data?.statusMsg === "fail" || data?.status === "fail") {
            throw new Error(data?.message || "The request could not be completed.");
        }
    }


    async getUserOrders(token: string): Promise<Order[] | null> {
        const requestOptions = { headers: { token }, cache: "no-store" } as const;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const verification = await fetch(baseUrl + "/api/v1/auth/verifyToken", requestOptions);

        if (verification.status === 401 || verification.status === 403) {
            return null;
        }
        if (!verification.ok) {
            throw new Error("Could not verify the user token");
        }

        const verified: VerifyTokenResponse = await verification.json();
        const userId = verified.decoded?.id;
        if (verified.message !== "verified" || typeof userId !== "string" || !userId) {
            throw new Error("Token verification did not return a user ID");
        }

        const response = await fetch(baseUrl + "/api/v1/orders/user/" + encodeURIComponent(userId), requestOptions);
        if (!response.ok) {
            throw new Error("Could not fetch the user's orders");
        }

        const orders: Order[] = await response.json();
        if (!Array.isArray(orders)) {
            throw new Error("Expected a list of orders");
        }
        return orders;
    }

    async getOrder(orderId: string, token: string): Promise<Order> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/orders/${encodeURIComponent(orderId)}`, {
            headers: { token }, cache: "no-store",
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) throw new Error(payload?.message || "Could not load this order.");
        return (payload?.data?.order ?? payload?.data ?? payload) as Order;
    }

    async getAllOrders(token: string): Promise<Order[]> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/orders/`, {
            headers: { token }, cache: "no-store",
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) throw new Error(payload?.message || "Could not load all orders.");
        const orders = Array.isArray(payload) ? payload : payload?.data?.orders ?? payload?.data;
        if (!Array.isArray(orders)) throw new Error("Unexpected orders response.");
        return orders as Order[];
    }

    async getAllUsers(token: string, options: { keyword?: string; limit?: number } = {}): Promise<AdminUser[]> {
        const params = new URLSearchParams({ limit: String(options.limit ?? 50) });
        if (options.keyword?.trim()) params.set("keyword", options.keyword.trim());
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users?${params}`, {
            headers: { token }, cache: "no-store",
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) throw new Error(payload?.message || "Could not load users.");
        const users = Array.isArray(payload) ? payload : payload?.data?.users ?? payload?.data;
        if (!Array.isArray(users)) throw new Error("Unexpected users response.");
        return users as AdminUser[];
    }

    async signin(email: string, password: string): Promise<SignInResponse> {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/auth/signin", {
            method: "post",
            headers: this.#jsonHeaders,
            body: JSON.stringify({
                email,
                password
            })
        })

        const data = await response.json()
        return data
    }

    async signup(values: { name: string; email: string; password: string; rePassword: string; phone: string }): Promise<{ message?: string; errors?: { msg?: string }[] }> {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/auth/signup", {
            method: "post",
            headers: this.#jsonHeaders,
            body: JSON.stringify(values),
        });

        const data = await response.json().catch(() => null);
        if (!response.ok || data?.statusMsg === "fail" || data?.status === "fail") {
            const detail = data?.errors?.[0]?.msg;
            throw new Error(detail || data?.message || "Could not create your account. Please try again.");
        }
        return data;
    }
}


const apiServices = new ApiServices()

export default apiServices;
