import { getWorkExperience } from "@/services/aboutService";
import { getPreserveWhitespaceStyle } from "@/utils/textFormatting";
import { BriefcaseIcon } from "@heroicons/react/24/outline";

export default async function ExperienceSection() {
  const experiences = await getWorkExperience();

  if (experiences.length === 0) {
    return null;
  }

  return (
    <section className="flex w-full flex-row flex-nowrap">
      <div className="flex w-fit flex-col">
        <div className="mb-2 flex flex-row items-center">
          <BriefcaseIcon className="ml-2 h-auto w-6 text-blue-300 sm:ml-4 sm:w-8 lg:ml-8 lg:w-10" />
          <h2 className="mx-2 flex text-base font-light text-blue-300 sm:mx-3 sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
            Experiencia Laboral
          </h2>
        </div>
        <div className="flex flex-row">
          <div className="gradient-dashed-line ml-[1.2rem] h-full w-[0.15rem] sm:ml-[2rem] sm:w-[0.18rem] lg:ml-[3.2rem] lg:w-[0.2rem]"></div>
          <div className="flex flex-col">
            {experiences.map(experience => (
              <div key={experience.id} className="my-2 sm:my-3 lg:my-4">
                <h3 className="mx-2 text-sm font-medium tracking-wide text-blue-300 sm:mx-3 sm:text-base sm:tracking-wider lg:text-lg xl:text-xl 2xl:text-2xl">
                  {experience.position}
                </h3>
                <p className="mx-2 text-justify text-xs text-red-400 sm:mx-3 sm:text-sm lg:text-base xl:text-lg">
                  {experience.company}
                </p>
                <p
                  className="mr-2 ml-2 text-justify text-xs text-gray-200 sm:mr-4 sm:ml-3 sm:text-sm lg:mr-8 lg:ml-4 lg:text-base xl:mr-16"
                  style={getPreserveWhitespaceStyle()}
                >
                  {experience.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
