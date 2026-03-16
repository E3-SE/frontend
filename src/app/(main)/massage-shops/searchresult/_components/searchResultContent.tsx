"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ShopCard } from "@/src/components/shops/shopCard";
import { useMassageShops } from "@/src/app/(main)/_hooks/useMassageShops";

export function SearchResultContent() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const { shops, isLoading, loadError } = useMassageShops({
    sort: "-averageRating",
    limit: 100,
  });

  const results = useMemo(() => {
    const normalized = query.toLowerCase();
    if (!normalized) {
      return [];
    }

    return shops.filter((shop) => {
      const target =
        `${shop.name} ${shop.address} ${shop.district} ${shop.province}`.toLowerCase();
      return target.includes(normalized);
    });
  }, [query, shops]);

  return (
    <section className="bg-surface px-6 py-20 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm font-medium text-on-surface-variant hover:text-primary"
        >
          ← Back to Home
        </Link>

        <h1 className="font-headline text-4xl font-bold text-on-surface">
          Search Results
        </h1>
        <p className="mt-2 text-on-surface-variant">
          {query
            ? `Showing results for "${query}"`
            : "Enter a query from the homepage search bar."}
        </p>

        <div className="mt-10">
          {isLoading ? (
            <p className="text-on-surface-variant">Loading massage shops...</p>
          ) : loadError ? (
            <p className="rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
              {loadError}
            </p>
          ) : results.length === 0 ? (
            <div className="rounded-xl bg-surface-container-low p-6 text-on-surface-variant">
              No shops matched your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {results.map((shop) => (
                <ShopCard key={shop._id} shop={shop} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}