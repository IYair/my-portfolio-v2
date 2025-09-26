import Image from "next/image";
import { RocketLaunchIcon, EnvelopeIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { getContactInfo } from "@/services/aboutService";

const getHeroiconComponent = (type: string) => {
  switch (type.toLowerCase()) {
    case "phone":
      return (
        <DevicePhoneMobileIcon className="ml-8 h-auto w-9 text-white drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)]" />
      );
    case "email":
      return (
        <EnvelopeIcon className="ml-8 h-auto w-9 text-white drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)]" />
      );
    default:
      return null;
  }
};

export default async function ContactSection() {
  const contactInfo = await getContactInfo();

  return (
    <div className="mt-10">
      <h2 className="m-3 flex items-center text-2xl font-thin text-white lg:text-3xl">
        <RocketLaunchIcon className="mr-4 h-auto w-10 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)]" />
        CONTACTAME
      </h2>
      <div className="flex flex-col space-y-6">
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
                    className="ml-8 h-auto w-8"
                  />
                )}
            <p className="ml-2 text-justify font-thin text-white">{contact.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
