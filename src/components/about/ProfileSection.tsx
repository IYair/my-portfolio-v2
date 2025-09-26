import Image from "next/image";
import { getAboutProfile } from "@/services/aboutService";

export default async function ProfileSection() {
  const profile = await getAboutProfile();

  if (!profile) {
    // Fallback to static data if no profile found
    return (
      <div className="relative aspect-[9/16] h-[650px]">
        <Image
          src="/images/me.png"
          alt="Imagen de perfil"
          fill
          sizes="100%"
          priority
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
          <h1 className="mt-4 block text-center text-2xl font-bold tracking-[0.2em] text-white">
            YAIR CHAN
          </h1>
          <div className="flex w-full items-start justify-center">
            <div className="mt-2 h-px flex-1 bg-gradient-to-r from-transparent to-white"></div>
            <h2 className="mb-4 px-4 text-center font-thin tracking-widest whitespace-nowrap text-white">
              SOFTWARE DEVELOPER
            </h2>
            <div className="mt-2 h-px flex-1 bg-gradient-to-l from-transparent to-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[9/16] h-[650px]">
      <Image
        src={profile.profileImage || "/images/me.png"}
        alt="Imagen de perfil"
        fill
        sizes="100%"
        priority
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
        <h1 className="mt-4 block text-center text-2xl font-bold tracking-[0.2em] text-white">
          {profile.name.toUpperCase()}
        </h1>
        <div className="flex w-full items-start justify-center">
          <div className="mt-2 h-px flex-1 bg-gradient-to-r from-transparent to-white"></div>
          <h2 className="mb-4 px-4 text-center font-thin tracking-widest whitespace-nowrap text-white">
            {profile.title.toUpperCase()}
          </h2>
          <div className="mt-2 h-px flex-1 bg-gradient-to-l from-transparent to-white"></div>
        </div>
      </div>
    </div>
  );
}
