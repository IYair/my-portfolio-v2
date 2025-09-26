import Image from "next/image";
import { getCourses } from "@/services/aboutService";

export default async function CoursesSection() {
  const coursesByProvider = await getCourses();

  if (Object.keys(coursesByProvider).length === 0) {
    return null;
  }

  return (
    <section className="ml-10">
      <h2 className="m-3 flex text-2xl font-extralight text-blue-900 lg:text-3xl">CURSOS</h2>

      <div className="flex flex-col">
        {Object.entries(coursesByProvider).map(([provider, courses]) => {
          const firstCourse = courses[0];
          return (
            <div key={provider} className="mb-8">
              {/* Provider Header */}
              <div className="flex w-full flex-row">
                {firstCourse.providerIcon && (
                  <Image
                    src={firstCourse.providerIcon}
                    alt={provider}
                    width={46}
                    height={46}
                    className="drop-shadow-[2px_8px_2px_rgba(0,0,0,0.4)]"
                  />
                )}
                <p className="ml-2 text-justify text-2xl tracking-widest text-blue-900 lg:text-3xl">
                  {provider.toUpperCase()}
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
                        width={24}
                        height={24}
                        className="drop-shadow-[1px_2px_1px_rgba(0,0,0,0.4)]"
                      />
                    )}
                    <p className="ml-2 text-justify tracking-widest text-blue-900">
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
