import { getCourses } from "@/services/aboutService";
import Image from "next/image";

export default async function CoursesSection() {
  const coursesByProvider = await getCourses();

  if (Object.keys(coursesByProvider).length === 0) {
    return null;
  }

  return (
    <section className="ml-10">
      <h2 className="m-3 flex text-2xl font-extralight text-blue-300 lg:text-3xl">CURSOS</h2>

      <div className="flex flex-col">
        {Object.entries(coursesByProvider).map(([provider, courses]) => {
          const firstCourse = courses[0];
          return (
            <div key={provider} className="mb-8">
              {/* Provider Header */}
              <div className="flex w-full flex-row items-center">
                {firstCourse.providerIcon && (
                  <div className="flex items-center justify-center rounded-lg bg-gray-700 p-2 shadow-sm">
                    <Image
                      src={firstCourse.providerIcon}
                      alt={provider}
                      width={32}
                      height={32}
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                )}
                <p className="ml-3 text-justify text-xl tracking-widest text-blue-300 lg:text-xl">
                  {provider.toWellFormed()}
                </p>
              </div>

              {/* Courses List */}
              <div className="mt-6 ml-16 space-y-4">
                {courses.map(course => (
                  <div key={course.id} className="flex items-center">
                    {course.icon && (
                      <Image
                        src={course.icon}
                        alt={course.title}
                        width={44}
                        height={44}
                        className="drop-shadow-[1px_2px_1px_rgba(0,0,0,0.4)]"
                      />
                    )}
                    <p className="ml-3 text-justify tracking-widest text-blue-300">
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
