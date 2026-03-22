import { Suspense } from "react";
import { SearchResultContent } from "../../../../components/pages/searchResultContent";

export default function SearchResultPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-surface px-6 py-20 lg:px-20">
          <div className="mx-auto max-w-7xl text-on-surface-variant">
            Loading search results...
          </div>
        </section>
      }
    >
      <SearchResultContent />
    </Suspense>
  );
}
