"use client";

import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import AddToCartBtn from "./AddToCartBtn";
import { wishlistContext } from "@/contexts/wishlistContext";
export interface ProductCardProps {
  title: string;
  price: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[];
  _id: string;
}

export function ProductCard({
  title,
  price,
  ratingsAverage,
  ratingsQuantity,
  images,
  _id,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { ids, toggle } = useContext(wishlistContext);
  const isWishlisted = ids.has(_id);
  const productImages = images?.length ? images : [""];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden group bg-background text-foreground shadow-xl hover:shadow-lg transition-all duration-300 rounded-md p-0">
      {/* Image carousel */}
      <div className="relative aspect-3/4 overflow-hidden p-0">
        <Link href={`/products/${_id}`} aria-label={`View ${title} details`} className="absolute inset-0 z-0 block">
          <motion.img
            key={currentImageIndex}
            src={productImages[currentImageIndex] || "/placeholder-product.svg"}
            alt={`${title} - View ${currentImageIndex + 1}`}
            className="object-cover w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </Link>

        {/* Navigation arrows */}
        {productImages.length > 1 && <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="pointer-events-auto h-8 w-8 rounded-full bg-background/80 shadow-sm backdrop-blur-sm"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="pointer-events-auto h-8 w-8 rounded-full bg-background/80 shadow-sm backdrop-blur-sm"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>}

        {/* Image indicators */}
        <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
          {productImages.map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentImageIndex ? "bg-primary w-4" : "bg-primary/30"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
            />
          ))}
        </div>

        {/* Wishlist button */}
        <Button
          variant="secondary"
          size="icon"
          className={`absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm ${
            isWishlisted ? "text-rose-500" : ""
          }`}
            aria-label={isWishlisted ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`}
            aria-pressed={isWishlisted}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            void toggle(_id);
          }}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
        </Button>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <Link
              href={"/products/" + _id}
              className="font-medium line-clamp-1"
            >
              {title}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="ml-1 text-sm font-medium">
                  {ratingsAverage}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({ratingsQuantity} reviews)
              </span>
              <span className="text-xs text-emerald-600 ml-auto">
                Free shipping
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">{formatPrice(price)}</span>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4">
        <AddToCartBtn productId={_id} />
      </CardFooter>
    </Card>
  );
}
