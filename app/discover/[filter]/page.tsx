import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, ArrowLeft, Filter } from "lucide-react";
import {
  getFilteredDesigns,
  getFilterOptions,
  type FilterType,
  type FilteredDesign,
  type FilterOptions,
} from "./actions";

type Props = {
  params: Promise<{ filter: string }>;
};

const GENDER_VALUES = ["male", "female", "unisex"] as const;
const SIZE_VALUES = [
  "small",
  "medium",
  "large",
  "extra-large",
  "full-coverage",
] as const;

function parseFilter(
  filter: string
): { type: FilterType; value: string; dbValue: string } | null {
  const decoded = decodeURIComponent(filter).toLowerCase().replace(/-/g, "_");

  // Check if it's a gender filter
  if (GENDER_VALUES.includes(decoded.replace(/_/g, "-") as any)) {
    return {
      type: "gender",
      value: decoded.replace(/_/g, "-"),
      dbValue: decoded.toUpperCase(),
    };
  }

  // Check if it's a size filter
  if (SIZE_VALUES.includes(decoded.replace(/_/g, "-") as any)) {
    return {
      type: "size",
      value: decoded.replace(/_/g, "-"),
      dbValue: decoded.toUpperCase(),
    };
  }

  // Otherwise treat as body part
  return {
    type: "bodyPart",
    value: filter.toLowerCase(),
    dbValue: decodeURIComponent(filter),
  };
}

function formatFilterTitle(type: FilterType, value: string): string {
  const formatted = value.replace(/-/g, " ").replace(/_/g, " ");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function getFilterDescription(
  type: FilterType,
  value: string,
  count: number
): string {
  const formatted = formatFilterTitle(type, value);
  switch (type) {
    case "gender":
      return `Explore ${count}+ stunning ${formatted.toLowerCase()} tattoo designs. Find inspiration for your next ink with our curated collection of ${formatted.toLowerCase()} tattoos from top artists.`;
    case "size":
      return `Discover ${count}+ beautiful ${formatted.toLowerCase()} tattoo designs. Browse ${formatted.toLowerCase()} sized tattoos perfect for any body placement.`;
    case "bodyPart":
      return `Browse ${count}+ amazing ${formatted.toLowerCase()} tattoo designs. Get inspired by unique ${formatted.toLowerCase()} tattoo ideas from professional tattoo artists.`;
    default:
      return `Browse ${count}+ tattoo designs.`;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { filter } = await params;
  const parsed = parseFilter(filter);

  if (!parsed) {
    return { title: "Filter Not Found | InkSesh" };
  }

  const { designs, total } = await getFilteredDesigns(
    parsed.type,
    parsed.dbValue,
    1
  );
  const title = formatFilterTitle(parsed.type, parsed.value);
  const description = getFilterDescription(parsed.type, parsed.value, total);

  const filterTypeLabels: Record<FilterType, string> = {
    gender: "Gender",
    size: "Size",
    bodyPart: "Body Part",
  };
  const filterTypeLabel = filterTypeLabels[parsed.type];

  return {
    title: `${title} Tattoo Designs | ${filterTypeLabel} Filter | InkSesh`,
    description,
    keywords: [
      `${title.toLowerCase()} tattoos`,
      `${title.toLowerCase()} tattoo designs`,
      `${title.toLowerCase()} tattoo ideas`,
      `${parsed.type} tattoos`,
      "tattoo inspiration",
      "tattoo gallery",
      "ink designs",
      "tattoo artists",
    ],
    openGraph: {
      title: `${title} Tattoo Designs | InkSesh`,
      description,
      type: "website",
      images: designs[0]?.imageUrl
        ? [{ url: designs[0].imageUrl, alt: `${title} tattoo design` }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} Tattoo Designs`,
      description,
    },
    alternates: {
      canonical: `/discover/${filter}`,
    },
  };
}

export async function generateStaticParams(): Promise<{ filter: string }[]> {
  const filterOptions: FilterOptions = await getFilterOptions();

  const params: { filter: string }[] = [];

  // Add gender filters
  filterOptions.genders.forEach((g: string) => {
    params.push({ filter: g.toLowerCase().replace(/_/g, "-") });
  });

  // Add size filters
  filterOptions.sizes.forEach((s: string) => {
    params.push({ filter: s.toLowerCase().replace(/_/g, "-") });
  });

  // Add body part filters (top 20 most common)
  filterOptions.bodyParts.slice(0, 20).forEach((bp: string) => {
    params.push({ filter: encodeURIComponent(bp.toLowerCase()) });
  });

  return params;
}

const formatText = (text: string) => text.toLowerCase().replace(/_/g, " ");

export default async function FilterPage({ params }: Props) {
  const { filter } = await params;
  const parsed = parseFilter(filter);

  if (!parsed) {
    notFound();
  }

  const { designs, total, filterOptions } = await getFilteredDesigns(
    parsed.type,
    parsed.dbValue
  );
  const title = formatFilterTitle(parsed.type, parsed.value);

  const filterTypeLabels: Record<FilterType, string> = {
    gender: "Gender",
    size: "Size",
    bodyPart: "Body Part",
  };
  const filterTypeLabel = filterTypeLabels[parsed.type];

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${title} Tattoo Designs`,
    description: getFilterDescription(parsed.type, parsed.value, total),
    numberOfItems: total,
    itemListElement: designs
      .slice(0, 10)
      .map((design: FilteredDesign, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "ImageObject",
          name: design.title,
          contentUrl: design.imageUrl,
          creator: {
            "@type": "Person",
            name: design.artist.username,
          },
        },
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-neutral-950 text-white pb-20">
        {/* Hero Section */}
        <header className="relative w-full py-12 md:py-16 px-4 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />

          <nav className="relative z-10 max-w-7xl mx-auto mb-6">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Discover</span>
            </Link>
          </nav>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-rose-400 text-xs font-medium">
              <Filter className="w-3 h-3" />
              <span>
                {filterTypeLabel}: {title}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
              <span className="text-rose-500 capitalize">{title}</span> Tattoo
              Designs
            </h1>

            <p className="text-neutral-400 text-sm md:text-base max-w-lg mx-auto">
              {getFilterDescription(parsed.type, parsed.value, total)}
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>{total} designs found</span>
            </div>
          </div>
        </header>

        {/* Filter Navigation */}
        <nav
          className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-white/5 py-4"
          aria-label="Filter options"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="space-y-3">
              {/* Gender Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-500 font-medium w-16">
                  Gender:
                </span>
                {filterOptions.genders.map((g: string) => {
                  const slug = g.toLowerCase().replace(/_/g, "-");
                  const isActive =
                    parsed.type === "gender" && parsed.dbValue === g;
                  return (
                    <Link
                      key={g}
                      href={`/discover/${slug}`}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        isActive
                          ? "bg-rose-600 border-rose-500 text-white"
                          : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                      }`}
                    >
                      {formatText(g)}
                    </Link>
                  );
                })}
              </div>

              {/* Size Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-500 font-medium w-16">
                  Size:
                </span>
                {filterOptions.sizes.map((s: string) => {
                  const slug = s.toLowerCase().replace(/_/g, "-");
                  const isActive =
                    parsed.type === "size" && parsed.dbValue === s;
                  return (
                    <Link
                      key={s}
                      href={`/discover/${slug}`}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        isActive
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                      }`}
                    >
                      {formatText(s)}
                    </Link>
                  );
                })}
              </div>

              {/* Body Part Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-500 font-medium w-16">
                  Body:
                </span>
                <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
                  {filterOptions.bodyParts.slice(0, 12).map((bp: string) => {
                    const slug = encodeURIComponent(bp.toLowerCase());
                    const isActive =
                      parsed.type === "bodyPart" &&
                      parsed.dbValue.toLowerCase() === bp.toLowerCase();
                    return (
                      <Link
                        key={bp}
                        href={`/discover/${slug}`}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${
                          isActive
                            ? "bg-purple-600 border-purple-500 text-white"
                            : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                        }`}
                      >
                        {bp}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Results Section */}
        <section
          className="max-w-7xl mx-auto px-4 md:px-6 mt-6"
          aria-label="Tattoo designs"
        >
          {designs.length === 0 ? (
            <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800 border-dashed">
              <Filter className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-neutral-300 mb-2">
                No designs found
              </h2>
              <p className="text-neutral-500 mb-4">
                Try a different filter or browse all designs.
              </p>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-full text-sm font-medium transition-colors"
              >
                View All Designs
              </Link>
            </div>
          ) : (
            <div
              className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4"
              role="list"
              aria-label={`${title} tattoo designs gallery`}
            >
              {designs.map((design: FilteredDesign) => (
                <article
                  key={design.id}
                  className="break-inside-avoid group relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-rose-500/50 transition-all duration-300 mb-3 md:mb-4"
                  role="listitem"
                >
                  <Link
                    href={`/artist/${design.artist.username}`}
                    className="block"
                  >
                    <figure className="relative w-full">
                      <Image
                        src={design.imageUrl}
                        alt={`${design.title} - ${formatText(
                          design.gender
                        )} ${formatText(design.size)} tattoo on ${
                          design.bodyPart
                        } by ${design.artist.username}`}
                        width={500}
                        height={700}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />

                      <figcaption className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:bg-black/70 md:from-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <h3 className="font-bold text-white text-xs md:text-base leading-tight line-clamp-2">
                          {design.title || "Untitled Design"}
                        </h3>

                        <div className="flex items-center gap-2 mt-1.5">
                          <div
                            className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center text-[10px] font-bold text-white"
                            aria-hidden="true"
                          >
                            {design.artist.username[0].toUpperCase()}
                          </div>
                          <span className="text-[11px] md:text-xs text-neutral-300">
                            @{design.artist.username}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2 text-[8px] md:text-[10px]">
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 capitalize">
                            {formatText(design.gender)}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 capitalize">
                            {formatText(design.size)}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize truncate max-w-[60px] md:max-w-none">
                            {design.bodyPart}
                          </span>
                        </div>
                      </figcaption>
                    </figure>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* SEO Footer with Related Links */}
        <footer className="max-w-7xl mx-auto px-4 md:px-6 mt-16">
          <div className="border-t border-neutral-800 pt-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              Explore More Tattoo Designs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Gender Links */}
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">
                  By Gender
                </h3>
                <ul className="space-y-1">
                  {filterOptions.genders.map((g: string) => (
                    <li key={g}>
                      <Link
                        href={`/discover/${g.toLowerCase().replace(/_/g, "-")}`}
                        className="text-sm text-neutral-500 hover:text-rose-400 transition-colors"
                      >
                        {formatText(g)} Tattoos
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Size Links */}
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">
                  By Size
                </h3>
                <ul className="space-y-1">
                  {filterOptions.sizes.map((s: string) => (
                    <li key={s}>
                      <Link
                        href={`/discover/${s.toLowerCase().replace(/_/g, "-")}`}
                        className="text-sm text-neutral-500 hover:text-rose-400 transition-colors"
                      >
                        {formatText(s)} Tattoos
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Body Part Links */}
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">
                  By Body Part
                </h3>
                <ul className="space-y-1">
                  {filterOptions.bodyParts.slice(0, 8).map((bp: string) => (
                    <li key={bp}>
                      <Link
                        href={`/discover/${encodeURIComponent(
                          bp.toLowerCase()
                        )}`}
                        className="text-sm text-neutral-500 hover:text-rose-400 transition-colors"
                      >
                        {bp} Tattoos
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
