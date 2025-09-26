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
        <div className="mb-2 flex flex-row">
          <AcademicCapIcon className="ml-8 h-auto w-10 text-red-600" />
          <h2 className="mx-3 flex text-2xl font-light text-red-600 lg:text-3xl">
            Capacitación Académica
          </h2>
        </div>
        <div className="flex flex-row">
          <div className="ml-[3.2rem] h-full w-fit border-l-2 border-dashed border-l-red-600"></div>
          <div className="flex flex-col">
            {educations.map(education => (
              <div key={education.id} className="my-4">
                <h3 className="mx-3 text-xl font-medium tracking-wider text-blue-900 lg:text-2xl">
                  {education.institution}
                </h3>
                <p className="mx-3 text-justify text-lg text-red-600">
                  {education.degree}
                  {education.field && ` en ${education.field}`}
                </p>
                {(education.startDate || education.endDate) && (
                  <p className="mx-3 text-justify text-sm text-gray-600">
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
