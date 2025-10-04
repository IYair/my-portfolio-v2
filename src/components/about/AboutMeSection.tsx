import { getAboutProfile } from "@/services/aboutService";
import { getPreserveWhitespaceStyle } from "@/utils/textFormatting";
import { UserIcon } from "@heroicons/react/24/outline";

export default async function AboutMeSection() {
  const profile = await getAboutProfile();

  if (!profile) {
    // Fallback content
    return (
      <div>
        <h2 className="m-2 flex items-center text-lg font-bold text-blue-300 sm:m-3 sm:text-xl lg:text-2xl xl:text-3xl">
          <UserIcon className="mr-2 h-auto w-7 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)] sm:mr-3 sm:w-8 lg:mr-4 lg:w-10" />
          SOBRE MI
        </h2>
        <h3 className="m-2 text-sm text-blue-400 sm:m-3 sm:text-base lg:text-lg xl:text-xl">
          Software Developer | Web Developer | Full Stack Developer
        </h3>
        <p
          className="m-2 pr-2 text-justify text-sm text-gray-200 sm:m-3 sm:pr-4 sm:text-base lg:pr-10"
          style={getPreserveWhitespaceStyle()}
        >
          Como profesional en tecnologías web y desarrollo de software, me destaco por mi pasión por
          la innovación y el aprendizaje constante.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="m-2 flex items-center text-lg font-bold text-blue-300 sm:m-3 sm:text-xl lg:text-2xl xl:text-3xl">
        <UserIcon className="mr-2 h-auto w-7 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)] sm:mr-3 sm:w-8 lg:mr-4 lg:w-10" />
        SOBRE MI
      </h2>
      <h3 className="m-2 text-sm text-blue-400 sm:m-3 sm:text-base lg:text-lg xl:text-xl">
        {profile.subtitle}
      </h3>
      <p
        className="m-2 pr-2 text-justify text-sm text-gray-200 sm:m-3 sm:pr-4 sm:text-base lg:pr-10"
        style={getPreserveWhitespaceStyle()}
      >
        {profile.bio}
      </p>
    </div>
  );
}
