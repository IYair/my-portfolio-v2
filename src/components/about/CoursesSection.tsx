import { getCourses } from "@/services/aboutService";
import Image from "next/image";

export default async function CoursesSection() {
  const coursesByProvider = await getCourses();

  if (Object.keys(coursesByProvider).length === 0) {
    return null;
  }

  return (
    <section className="ml-2 sm:ml-4 lg:ml-10">
      <h2 className="m-2 flex text-base font-extralight text-blue-300 sm:m-3 sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
        CURSOS
      </h2>

      <div className="flex flex-col">
        {Object.entries(coursesByProvider).map(([provider, courses]) => {
          const firstCourse = courses[0];
          return (
            <div key={provider} className="mb-4 sm:mb-6 lg:mb-8">
              {/* Provider Header */}
              <div className="flex w-full flex-row items-center">
                {firstCourse.providerIcon && (
                  <div className="flex items-center justify-center rounded-lg bg-gray-700 p-1 shadow-sm sm:p-1.5 lg:p-2">
                    <Image
                      src={firstCourse.providerIcon}
                      alt={provider}
                      width={32}
                      height={32}
                      className="h-10 w-10 object-contain sm:h-12 sm:w-12 lg:h-16 lg:w-16"
                    />
                  </div>
                )}
                <p className="ml-2 text-justify text-xs tracking-wide text-blue-300 sm:ml-3 sm:text-sm sm:tracking-widest lg:text-base xl:text-lg 2xl:text-xl">
                  {provider.toWellFormed()}
                </p>
              </div>

              {/* Courses List */}
              <div className="mt-3 ml-4 space-y-2 sm:mt-4 sm:ml-8 sm:space-y-3 lg:mt-6 lg:ml-16 lg:space-y-4">
                {courses.map(course => (
                  <div key={course.id} className="flex items-center">
                    {course.icon && (
                      <Image
                        src={course.icon}
                        alt={course.title}
                        width={44}
                        height={44}
                        className="h-6 w-6 drop-shadow-[1px_2px_1px_rgba(0,0,0,0.4)] sm:h-8 sm:w-8 lg:h-11 lg:w-11"
                      />
                    )}
                    <p className="ml-2 text-justify text-xs tracking-wide text-blue-300 sm:ml-3 sm:text-sm sm:tracking-widest lg:text-base">
                      {course.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
