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
        <div className="mb-2 flex flex-row">
          <BriefcaseIcon className="ml-8 h-auto w-10 text-blue-300" />
          <h2 className="mx-3 flex text-2xl font-light text-blue-300 lg:text-3xl">
            Experiencia Laboral
          </h2>
        </div>
        <div className="flex flex-row">
          <div className="gradient-dashed-line ml-[3.2rem] h-full w-[0.2rem]"></div>
          <div className="flex flex-col">
            {experiences.map(experience => (
              <div key={experience.id} className="my-4">
                <h3 className="mx-3 text-xl font-medium tracking-wider text-blue-300 lg:text-2xl">
                  {experience.position}
                </h3>
                <p className="mx-3 text-justify text-lg text-red-400">{experience.company}</p>
                <p
                  className="mr-16 ml-4 text-justify text-gray-200"
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
