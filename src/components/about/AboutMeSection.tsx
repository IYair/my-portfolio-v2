import { UserIcon } from "@heroicons/react/24/outline";
import { getAboutProfile } from "@/services/aboutService";
import { getPreserveWhitespaceStyle } from "@/utils/textFormatting";

export default async function AboutMeSection() {
  const profile = await getAboutProfile();

  if (!profile) {
    // Fallback content
    return (
      <div>
        <h2 className="m-3 flex items-center text-2xl font-bold text-blue-900 lg:text-3xl">
          <UserIcon className="mr-4 h-auto w-10 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)]" />
          SOBRE MI
        </h2>
        <h3 className="m-3 text-xl text-blue-900">
          Software Developer | Web Developer | Full Stack Developer
        </h3>
        <p className="m-3 pr-10 text-justify text-blue-900" style={getPreserveWhitespaceStyle()}>
          Como profesional en tecnologías web y desarrollo de software, me destaco por mi pasión por
          la innovación y el aprendizaje constante.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="m-3 flex items-center text-2xl font-bold text-blue-900 lg:text-3xl">
        <UserIcon className="mr-4 h-auto w-10 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)]" />
        SOBRE MI
      </h2>
      <h3 className="m-3 text-xl text-blue-900">{profile.subtitle}</h3>
      <p className="m-3 pr-10 text-justify text-blue-900" style={getPreserveWhitespaceStyle()}>
        {profile.bio}
      </p>
    </div>
  );
}
