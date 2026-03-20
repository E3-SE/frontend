import Link from "next/link";
import { MassagesResponse } from "@/interface";
import { ShopCard } from "@/src/components/shops/shopCard";
import { apiBaseUrl } from "@/src/lib/config";

export const revalidate = 60;

async function getMassageShops() {
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/massages?sort=-averageRating&limit=100`,
      {
        next: { revalidate },
      },
    );

    if (!response.ok) {
      throw new Error("Unable to fetch massage shops.");
    }

    const payload = (await response.json()) as MassagesResponse;
    return { shops: payload.data ?? [], loadError: null as string | null };
  } catch {
    return {
      shops: [],
      loadError:
        "We could not load massage shops right now. Please try again later.",
    };
  }
}

export default async function MassageShopsPage() {
  const { shops, loadError } = await getMassageShops();

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
          Massage Shops
        </h1>
        <p className="mt-2 max-w-2xl text-on-surface-variant">
          Explore all available massage shops and choose the one that matches your
          preferred location, atmosphere, and budget.
        </p>

        <div className="mt-10">
          {loadError ? (
            <p className="rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
              {loadError}
            </p>
          ) : shops.length === 0 ? (
            <div className="rounded-xl bg-surface-container-low p-6 text-on-surface-variant">
              No massage shops available right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {shops.map((shop) => (
                <ShopCard key={shop._id} shop={shop} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
