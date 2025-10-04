import Image from "next/image";
import { RocketLaunchIcon, EnvelopeIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { getContactInfo } from "@/services/aboutService";

const getHeroiconComponent = (type: string) => {
  switch (type.toLowerCase()) {
    case "phone":
      return (
        <DevicePhoneMobileIcon className="ml-4 h-auto w-6 text-gray-800 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)] sm:ml-6 sm:w-7 lg:ml-8 lg:w-9 dark:text-white" />
      );
    case "email":
      return (
        <EnvelopeIcon className="ml-4 h-auto w-6 text-gray-800 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)] sm:ml-6 sm:w-7 lg:ml-8 lg:w-9 dark:text-white" />
      );
    default:
      return null;
  }
};

export default async function ContactSection() {
  const contactInfo = await getContactInfo();

  return (
    <div className="mt-6 sm:mt-8 lg:mt-10">
      <h2 className="m-2 flex items-center text-lg font-thin text-gray-800 sm:m-3 sm:text-xl lg:text-2xl xl:text-3xl dark:text-white">
        <RocketLaunchIcon className="mr-2 h-auto w-7 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)] sm:mr-3 sm:w-8 lg:mr-4 lg:w-10" />
        <span className="text-sm sm:text-base lg:text-lg xl:text-xl">CONTACTAME</span>
      </h2>
      <div className="flex flex-row flex-wrap gap-3 sm:gap-4 lg:flex-col lg:gap-0 lg:space-y-6">
        {contactInfo.map(contact => (
          <div key={contact.id} className="flex flex-row items-center">
            {contact.isHeroicon
              ? getHeroiconComponent(contact.type)
              : contact.icon && (
                  <Image
                    src={contact.icon}
                    alt={contact.value}
                    width={24}
                    height={24}
                    className="ml-4 h-auto w-6 sm:ml-6 sm:w-7 lg:ml-8 lg:w-8"
                  />
                )}
            {contact.type.toLowerCase() === "email" ? (
              <a
                href={`mailto:${contact.value}`}
                className="ml-2 text-xs font-thin break-all text-gray-800 transition-colors duration-200 hover:text-blue-500 active:text-blue-600 sm:text-sm lg:text-base dark:text-white dark:hover:text-blue-400 dark:active:text-blue-500"
              >
                {contact.value}
              </a>
            ) : (
              <p className="ml-2 text-xs font-thin break-all text-gray-800 sm:text-sm lg:text-base dark:text-white">
                {contact.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
