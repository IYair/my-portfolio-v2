import Image from "next/image";
import { TrophyIcon } from "@heroicons/react/24/outline";
import { getSkills } from "@/services/aboutService";
import { getTranslations } from "next-intl/server";

export default async function SkillsSection() {
  const t = await getTranslations("aboutPage");
  const skills = await getSkills();

  return (
    <div className="mt-6 sm:mt-8 lg:mt-10">
      <h2 className="m-2 flex items-center text-lg font-thin text-gray-800 sm:m-3 sm:text-xl lg:text-2xl xl:text-3xl dark:text-white">
        <TrophyIcon className="mr-2 h-auto w-7 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)] sm:mr-3 sm:w-8 lg:mr-4 lg:w-10" />
        <span className="text-sm sm:text-base lg:text-lg xl:text-xl">
          {t("skills").toUpperCase()}
        </span>
      </h2>
      <div className="mt-4 grid grid-cols-3 gap-3 sm:mt-6 sm:grid-cols-4 sm:gap-4 lg:mt-10">
        {skills.map(skill => (
          <div key={skill.id} className="flex flex-col items-center">
            <Image
              src={skill.icon}
              alt={skill.name}
              height={64}
              width={64}
              className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16"
            />
            <p className="mt-1 text-center text-xs font-thin text-gray-800 sm:text-sm dark:text-white">
              {skill.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
