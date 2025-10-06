import { getAboutProfile } from "@/services/aboutService";
import { getPreserveWhitespaceStyle } from "@/utils/textFormatting";
import { UserIcon } from "@heroicons/react/24/outline";
import { getLocale, getTranslations } from "next-intl/server";

export default async function AboutMeSection() {
  const locale = (await getLocale()) as "es" | "en";
  const t = await getTranslations("aboutPage");
  const profile = await getAboutProfile(locale);

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

  // Check if we have rich content (HTML)
  const hasRichContent = profile.bioHtml && profile.bioHtml.trim() !== "";

  return (
    <div>
      <h2 className="m-2 flex items-center text-lg font-bold text-blue-300 sm:m-3 sm:text-xl lg:text-2xl xl:text-3xl">
        <UserIcon className="mr-2 h-auto w-7 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)] sm:mr-3 sm:w-8 lg:mr-4 lg:w-10" />
        {t("aboutMe").toUpperCase()}
      </h2>
      <h3 className="m-2 text-sm text-blue-400 sm:m-3 sm:text-base lg:text-lg xl:text-xl">
        {profile.subtitle}
      </h3>
      {hasRichContent ? (
        <div
          className="prose prose-sm prose-invert prose-p:my-2 prose-p:text-justify prose-p:text-gray-200 prose-strong:text-gray-100 prose-a:text-blue-400 prose-headings:text-blue-300 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-code:text-blue-300 prose-code:bg-blue-500/10 sm:prose-base m-2 max-w-none pr-2 sm:m-3 sm:pr-4 lg:pr-10"
          dangerouslySetInnerHTML={{ __html: profile.bioHtml || "" }}
        />
      ) : (
        <p
          className="m-2 pr-2 text-justify text-sm text-gray-200 sm:m-3 sm:pr-4 sm:text-base lg:pr-10"
          style={getPreserveWhitespaceStyle()}
        >
          {profile.bio}
        </p>
      )}
    </div>
  );
}
