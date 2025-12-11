import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getArtistByUsername } from "./actions";

type Props = {
  params: Promise<{ username: string }>;
};

const formatText = (text: string) => text.toLowerCase().replace(/_/g, " ");

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const artist = await getArtistByUsername(params.username);

  if (!artist) return { title: "Artist Not Found - InkSesh" };

  const displayName =
    artist.username.charAt(0).toUpperCase() + artist.username.slice(1);

  return {
    title: { absolute: `${displayName} - Tattoo Portfolio` },
    description: `Check out ${displayName}'s latest tattoo designs on InkSesh.`,
    openGraph: {
      title: `${displayName} - Tattoo Portfolio`,
      images: artist.profileUrl ? [artist.profileUrl] : [],
    },
  };
}

export default async function PublicArtistPage(props: Props) {
  const params = await props.params;
  const artist = await getArtistByUsername(params.username);
  if (!artist) return notFound();

  const displayName =
    artist.username.charAt(0).toUpperCase() + artist.username.slice(1);

  const headerImage = artist.designs[0]?.imageUrl || artist.profileUrl || null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header
        className="
          relative w-full 
          h-[30vh] 
          min-h-[180px] 
          max-h-[380px]
          overflow-hidden 
          border-b border-white/5
        "
      >
        {headerImage ? (
          <>
            <Image
              src={headerImage}
              alt="Background"
              fill
              priority
              className="object-cover blur-[60px] opacity-60 scale-125"
            />
            <div className="absolute inset-0 bg-neutral-950/40" />
            <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-linear-to-b from-neutral-900 to-neutral-950" />
        )}
      </header>

      <div
        className="
          max-w-6xl mx-auto 
          px-4 sm:px-6 
          pb-20
          -mt-[12vh] sm:-mt-[14vh] md:-mt-[16vh]
          relative
        "
      >
        <section
          className="
            flex flex-col md:flex-row 
            items-center md:items-start 
            gap-6 sm:gap-8 md:gap-12 
            pb-10 pt-6 
             border-neutral-800
          "
        >
          <div
            className="
              relative rounded-full overflow-hidden 
              border-4 border-neutral-900 
              shadow-xl ring-4 ring-neutral-950
              flex items-center justify-center 
              bg-rose-600
              w-[clamp(90px,20vw,150px)] 
              h-[clamp(90px,20vw,150px)]
            "
          >
            <span
              className="
                text-white font-bold 
                text-[clamp(2rem,6vw,4rem)]
              "
            >
              {artist.username[0].toUpperCase()}
            </span>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-bold">
              {displayName}
            </h1>

            <p className="text-neutral-400 mt-1 text-[clamp(0.8rem,1.5vw,1.1rem)]">
              @{artist.username} • Tattoo Artist
            </p>

            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              <span
                className="
                  px-3 py-1 bg-neutral-900 rounded-full 
                  text-[clamp(0.7rem,1.3vw,0.9rem)]
                  text-neutral-300 
                  border border-neutral-800
                "
              >
                {artist.designs.length} Designs
              </span>
            </div>
          </div>

          <button
            className="
              bg-white text-black 
              px-6 py-2.5 rounded-full font-bold 
              hover:bg-neutral-200 transition 
              active:scale-95 shadow-lg
              text-[clamp(0.8rem,1.6vw,1rem)]
              mt-4 md:mt-0
            "
          >
            Book Appointment
          </button>
        </section>

        <section className="mt-12">
          <h2 className="text-[clamp(1.2rem,2vw,1.6rem)] font-semibold mb-6">
            Portfolio
          </h2>

          {artist.designs.length > 0 ? (
            <div
              className="
                grid
                grid-cols-[repeat(auto-fill,minmax(150px,1fr))]
                sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]
                gap-3 sm:gap-4
              "
            >
              {artist.designs.map((design) => (
                <div
                  key={design.id}
                  className="
                    group relative 
                    aspect-4/5 
                    bg-neutral-900 
                    rounded-xl overflow-hidden 
                    border border-neutral-800 shadow-sm
                  "
                >
                  <Image
                    src={design.imageUrl}
                    alt={design.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div
                    className="
                      absolute inset-0 
                      bg-linear-to-t from-black/90 via-black/40 to-transparent
                      md:bg-black/70 md:from-transparent
                      md:opacity-0 md:group-hover:opacity-100 
                      transition duration-300 
                      flex flex-col justify-end 
                      p-2.5 sm:p-3
                    "
                  >
                    <p
                      className="
                        font-bold 
                        text-[clamp(0.7rem,1.4vw,1rem)] 
                        leading-tight 
                        mb-1.5 sm:mb-2
                        line-clamp-2
                      "
                    >
                      {design.title}
                    </p>

                    <div
                      className="
                        flex flex-wrap gap-1 sm:gap-1.5 
                        text-[clamp(0.5rem,1vw,0.7rem)]
                      "
                    >
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 capitalize">
                        {formatText(design.gender)}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 capitalize">
                        {formatText(design.size)}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize truncate max-w-[70px] sm:max-w-none">
                        {design.bodyPart}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="
                text-center py-16 
                text-neutral-500 bg-neutral-900/40 
                rounded-xl border border-neutral-800 border-dashed
              "
            >
              <p className="text-[clamp(1rem,2vw,1.3rem)]">
                No designs uploaded yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
