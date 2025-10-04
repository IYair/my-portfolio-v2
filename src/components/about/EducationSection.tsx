import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { getEducation } from "@/services/aboutService";

export default async function EducationSection() {
  const educations = await getEducation();

  if (educations.length === 0) {
    return null;
  }

  return (
    <section className="flex w-full flex-row flex-nowrap">
      <div className="flex w-fit flex-col">
        <div className="mb-2 flex flex-row items-center">
          <AcademicCapIcon className="ml-2 h-auto w-6 text-red-400 sm:ml-4 sm:w-8 lg:ml-8 lg:w-10" />
          <h2 className="mx-2 flex text-base font-light text-red-400 sm:mx-3 sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
            Capacitación Académica
          </h2>
        </div>
        <div className="flex flex-row">
          <div className="gradient-dashed-line-fade ml-[1.2rem] h-full w-[0.15rem] sm:ml-[2rem] sm:w-[0.18rem] lg:ml-[3.2rem] lg:w-0.5"></div>
          <div className="flex flex-col">
            {educations.map(education => (
              <div key={education.id} className="my-2 sm:my-3 lg:my-4">
                <h3 className="mx-2 text-sm font-medium tracking-wide text-blue-300 sm:mx-3 sm:text-base sm:tracking-wider lg:text-lg xl:text-xl 2xl:text-2xl">
                  {education.institution}
                </h3>
                <p className="mx-2 text-justify text-xs text-red-400 sm:mx-3 sm:text-sm lg:text-base xl:text-lg">
                  {education.degree}
                  {education.field && ` en ${education.field}`}
                </p>
                {(education.startDate || education.endDate) && (
                  <p className="mx-2 text-justify text-xs text-gray-400 sm:mx-3 sm:text-sm">
                    {education.startDate}
                    {education.startDate && education.endDate && " - "}
                    {education.endDate}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
