"use client";

import { useEffect, useState } from "react";
import { MassageShop, MassagesResponse } from "@/src/types/interface";
import { apiBaseUrl } from "@/src/lib/config";

type UseMassageShopsOptions = {
  limit: number;
  sort: string;
};

export function useMassageShops({ limit, sort }: UseMassageShopsOptions) {
  const [shops, setShops] = useState<MassageShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMassages = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch(
          `${apiBaseUrl}/api/massages?sort=${sort}&limit=${limit}`,
        );

        if (!response.ok) {
          throw new Error("Unable to fetch massage shops.");
        }

        const payload = (await response.json()) as MassagesResponse;
        setShops(payload.data ?? []);
      } catch {
        setLoadError(
          "We could not load massage shops right now. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMassages();
  }, [limit, sort]);

  return { shops, isLoading, loadError };
}