import { getAboutProfile } from "@/services/aboutService";
import Image from "next/image";
import { getLocale } from "next-intl/server";

export default async function ProfileSection() {
  const locale = (await getLocale()) as "es" | "en";
  const profile = await getAboutProfile(locale);

  if (!profile) {
    // Fallback to static data if no profile found
    return (
      <div className="relative mt-4 aspect-[9/16] h-[450px] sm:mt-0 sm:h-[550px] lg:h-[650px]">
        <Image
          src="/images/me.png"
          alt="Imagen de perfil"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority
          fetchPriority="high"
          style={{ objectFit: "cover" }}
          className="rounded-2xl"
        />
        <div
          className="absolute bottom-[6%] left-[15%] flex h-auto w-3/4 flex-col items-center rounded-3xl border border-white/30 shadow-lg backdrop-blur-xl"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <h1 className="mt-2 block text-center text-lg font-bold tracking-[0.15em] text-white sm:mt-4 sm:text-xl lg:text-2xl lg:tracking-[0.2em]">
            YAIR CHAN
          </h1>
          <div className="flex w-full items-start justify-center">
            <div className="mt-1 h-px flex-1 bg-gradient-to-r from-transparent to-gray-900 sm:mt-2 dark:to-white"></div>
            <h2 className="mb-2 px-2 text-center text-xs font-thin tracking-wide whitespace-nowrap text-gray-900 sm:mb-4 sm:px-4 sm:text-sm sm:tracking-widest lg:text-base dark:text-white">
              SOFTWARE DEVELOPER
            </h2>
            <div className="mt-1 h-px flex-1 bg-gradient-to-l from-transparent to-gray-900 sm:mt-2 dark:to-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-4 aspect-[9/16] h-[450px] sm:mt-0 sm:h-[550px] lg:h-[650px]">
      <Image
        src={profile.profileImage || "/images/me.png"}
        alt="Imagen de perfil"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority
        fetchPriority="high"
        style={{ objectFit: "cover" }}
        className="rounded-2xl"
      />
      <div
        className="absolute bottom-[6%] left-[15%] flex h-auto w-3/4 flex-col items-center rounded-3xl border border-white/30 shadow-lg backdrop-blur-xl"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <h1 className="mt-2 block text-center text-lg font-bold tracking-[0.15em] text-white sm:mt-4 sm:text-xl lg:text-2xl lg:tracking-[0.2em]">
          {profile.name.toUpperCase()}
        </h1>
        <div className="flex w-full items-start justify-center">
          <div className="mt-1 h-px flex-1 bg-gradient-to-r from-transparent to-white sm:mt-2"></div>
          <h2 className="mb-2 px-2 text-center text-xs font-thin tracking-wide whitespace-nowrap text-white sm:mb-4 sm:px-4 sm:text-sm sm:tracking-widest lg:text-base">
            {profile.title.toUpperCase()}
          </h2>
          <div className="mt-1 h-px flex-1 bg-gradient-to-l from-transparent to-white sm:mt-2"></div>
        </div>
      </div>
    </div>
  );
}
