"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Product } from "@/types/shopify";
import { formatPriceRange } from "@/lib/utils/formatCurrency";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";
import ProductGallery from "./ProductGallery";
import QuantityStepper from "./QuantityStepper";
import VariantSelector from "./VariantSelector";
import { useAddToCart } from "./AddToCartClient";
import { buyNowAction } from "@/app/actions/cart";
import { useCartStore } from "@/store/cartStore";

export default function ProductDetail({
  product,
  locale,
  labels,
}: {
  product: Product;
  locale: Locale;
  labels: {
    addToCart: string;
    buyNow: string;
    selectVariant: string;
    vendor: string;
    outOfStock: string;
  };
}) {
  const images = (product.images as any)?.edges?.map((e: any) => e.node) || [];
  const galleryImages = images.length
    ? images
    : product.featuredImage
    ? [product.featuredImage]
    : [];
  const variants = (product.variants?.edges || []).map((e) => e.node);

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    product.options?.forEach((opt) => {
      init[opt.name] = opt.values[0] || "";
    });
    return init;
  });
  const [qty, setQty] = useState(1);
  const [buying, setBuying] = useState(false);
  const { add, pending } = useAddToCart();
  const setCart = useCartStore((s) => s.setCart);
  const router = useRouter();

  const selectedVariant = useMemo(
    () => variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)),
    [variants, selected]
  );

  const price = selectedVariant
    ? formatPriceRange(selectedVariant.price, selectedVariant.price, locale)
    : formatPriceRange(product.priceRange?.minVariantPrice, product.priceRange?.maxVariantPrice, locale);

  const compareAt = selectedVariant?.compareAtPrice;
  const hasDiscount = compareAt && Number(compareAt.amount) > Number(selectedVariant?.price?.amount || 0);

  async function handleBuyNow() {
    if (!selectedVariant) {
      toast.error(labels.selectVariant);
      return;
    }
    setBuying(true);
    try {
      const checkoutUrl = await buyNowAction(selectedVariant.id, qty);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error(labels.outOfStock);
      }
    } finally {
      setBuying(false);
    }
  }

  function handleAdd() {
    if (!selectedVariant) {
      toast.error(labels.selectVariant);
      return;
    }
    add(selectedVariant.id, qty);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <ProductGallery images={galleryImages} title={product.title} />

      <div className="flex flex-col">
        {product.vendor && <p className="text-sm font-medium text-ink-muted">{labels.vendor}: {product.vendor}</p>}
        <h1 className="mt-1 text-3xl font-bold text-ink-dark sm:text-4xl">{product.title}</h1>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-bold text-brand-orange">{price}</span>
          {hasDiscount && (
            <span className="text-lg text-ink-muted line-through">
              {formatPriceRange(compareAt, compareAt, locale)}
            </span>
          )}
        </div>

        {product.options && product.options.length > 0 && (
          <div className="mt-6">
            <VariantSelector
              options={product.options}
              variants={variants}
              selected={selected}
              onChange={setSelected}
              labels={{ selectVariant: labels.selectVariant }}
            />
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <QuantityStepper value={qty} onChange={setQty} />
          <button
            onClick={handleAdd}
            disabled={pending || !selectedVariant?.availableForSale}
            className="btn-primary flex-1"
          >
            {labels.addToCart}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={buying || !selectedVariant?.availableForSale}
            className="btn-secondary flex-1"
          >
            {labels.buyNow}
          </button>
        </div>

        <div
          className="prose prose-sm mt-8 max-w-none text-ink-muted"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
        />
      </div>
    </div>
  );
}
