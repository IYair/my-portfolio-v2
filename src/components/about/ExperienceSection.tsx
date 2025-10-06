import { getWorkExperience } from "@/services/aboutService";
import { parseTextWithLists } from "@/utils/textFormatting";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { getLocale, getTranslations } from "next-intl/server";

export default async function ExperienceSection() {
  const locale = (await getLocale()) as "es" | "en";
  const t = await getTranslations("aboutPage");
  const experiences = await getWorkExperience(locale);

  if (experiences.length === 0) {
    return null;
  }

  return (
    <section className="flex w-full flex-row flex-nowrap">
      <div className="flex w-fit flex-col">
        <div className="mb-2 flex flex-row items-center">
          <BriefcaseIcon className="ml-2 h-auto w-6 text-blue-300 sm:ml-4 sm:w-8 lg:ml-8 lg:w-10" />
          <h2 className="mx-2 flex text-base font-light text-blue-300 sm:mx-3 sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
            {t("experience")}
          </h2>
        </div>
        <div className="flex flex-row">
          <div className="gradient-dashed-line ml-[1.2rem] h-full w-[0.15rem] sm:ml-[2rem] sm:w-[0.18rem] lg:ml-[3.2rem] lg:w-[0.2rem]"></div>
          <div className="flex flex-col">
            {experiences.map(experience => {
              // Use descriptionHtml if available, otherwise fall back to parsing plain text
              const hasRichContent =
                experience.descriptionHtml && experience.descriptionHtml.trim() !== "";

              return (
                <div key={experience.id} className="my-2 sm:my-3 lg:my-4">
                  <h3 className="mx-2 text-sm font-medium tracking-wide text-blue-300 sm:mx-3 sm:text-base sm:tracking-wider lg:text-lg xl:text-xl 2xl:text-2xl">
                    {experience.position}
                  </h3>
                  <div className="mx-2 flex flex-row items-center justify-between sm:mx-3">
                    <p className="text-justify text-xs text-red-400 sm:text-sm lg:text-base xl:text-lg">
                      {experience.company}
                    </p>
                    <p className="ml-4 text-xs text-nowrap text-gray-400 capitalize sm:text-sm lg:text-base">
                      {experience.startDate?.toLowerCase()}
                      {experience.endDate &&
                        ` - ${experience.endDate.toLowerCase() === "presente" || experience.endDate.toLowerCase() === "present" ? t("present") : experience.endDate.toLowerCase()}`}
                    </p>
                  </div>

                  {hasRichContent ? (
                    <div
                      className="prose prose-sm prose-invert prose-p:my-2 prose-p:text-justify prose-p:text-gray-200 prose-ul:mx-0 prose-strong:text-gray-100 prose-a:text-blue-400 prose-headings:text-blue-300 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-code:text-blue-300 prose-code:bg-blue-500/10 sm:prose-base mx-2 mr-2 max-w-none sm:mx-3 sm:mr-4 lg:mr-8 xl:mr-16"
                      dangerouslySetInnerHTML={{ __html: experience.descriptionHtml || "" }}
                    />
                  ) : (
                    <div className="mr-2 ml-2 sm:mr-4 sm:ml-3 lg:mr-8 lg:ml-4 xl:mr-16">
                      {parseTextWithLists(experience.description).map((item, idx) => {
                        if (item.type === "text") {
                          return (
                            <p
                              key={idx}
                              className="mb-2 text-justify text-xs text-gray-200 sm:text-sm lg:text-base"
                            >
                              {item.content}
                            </p>
                          );
                        } else {
                          const prevItem = parseTextWithLists(experience.description)[idx - 1];

                          if (!prevItem || prevItem.type !== "list") {
                            const parsedContent = parseTextWithLists(experience.description);
                            const consecutiveListItems = [];
                            for (
                              let i = idx;
                              i < parsedContent.length && parsedContent[i].type === "list";
                              i++
                            ) {
                              consecutiveListItems.push(parsedContent[i]);
                            }

                            return (
                              <ul
                                key={idx}
                                className="mb-2 list-outside list-disc space-y-1 pl-4 text-xs text-gray-200 sm:text-sm lg:text-base"
                              >
                                {consecutiveListItems.map((listItem, listIdx) => (
                                  <li key={listIdx} className="text-justify">
                                    {listItem.content}
                                  </li>
                                ))}
                              </ul>
                            );
                          }
                          return null;
                        }
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
