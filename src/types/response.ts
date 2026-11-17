import { BrandI, CategoryI, ProductI, SubcategoryI } from "@/interfaces/product";

type ResponseT<T> = {
    results: number;
    metadata: {
        currentPage: number;
        numberOfPages: number;
        limit: number;
        nextPage: number;
        prevPage: number;
    };
    data: T[]
}

export type CartResponse = {
    status: string;
    message: string;
    numOfCartItems: number;
    cartId: string;
    data: Cart;
    statusMsg: string;
};

export type Cart = {
    _id: string;
    cartOwner: string;
    products: CartProduct[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    totalCartPrice: number;
    discount?: number;
    totalPriceAfterDiscount?: number;
    totalCartPriceAfterDiscount?: number;
    coupon?: { name?: string; code?: string } | string;
};

type CartProduct = {
    count: number;
    _id: string;
    product: Product;
    price: number;
};

export interface Product {
    subcategory: SubcategoryI[];
    _id: string;
    title: string;
    slug: string;
    quantity: number;
    imageCover: string;
    category: CategoryI;
    brand: BrandI;
    ratingsAverage: number;
    id: string;
};


export type CheckoutAddress = {
    details: string;
    phone: string;
    city: string;
};

export type AddressInput = CheckoutAddress & { name: string };
export type SavedAddress = AddressInput & { _id: string };

export type CheckoutResponse = {
    "status": string;
    "session": {
        "url": string;
        "success_url": string;
        "cancel_url": string
    }
}

export type SignInResponse = {
    message: string;
    user?: {
        _id?: string;
        id?: string;
        name: string;
        email: string;
        role: string;
        phone?: string;
    },
    token?: string;
    statusMsg?: string
}

export type VerifyTokenResponse = {
    message: "verified";
    decoded: { id: string };
};

export type AdminUser = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
};

export type Order = {
    _id: string;
    id: number;
    createdAt: string;
    totalOrderPrice: number;
    paymentMethodType: string;
    shippingAddress?: CheckoutAddress;
    isPaid: boolean;
    isDelivered: boolean;
    cartItems: {
        _id: string;
        count: number;
        price: number;
        product: Pick<Product, "title"> | null;
    }[];
};

export type Review = {
    _id: string;
    review: string;
    rating: number;
    createdAt?: string;
    updatedAt?: string;
    user?: { _id?: string; id?: string; name?: string } | string;
    product?: Product | ProductI | string;
};


export type ProductsResponse = ResponseT<ProductI>
export type ProductDetailsResponse = { data: ProductI }
