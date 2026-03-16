import { MassagesResponse } from "@/interface";
import { apiBaseUrl } from "@/src/lib/config";
import { HomePageClient } from "./_components/homePageClient";

export const revalidate = 60;

async function getMainPageShops() {
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/massages?sort=-averageRating&limit=60`,
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

export default async function Home() {
  const { shops, loadError } = await getMainPageShops();

  return <HomePageClient shops={shops} loadError={loadError} />;
}
