import Image from "next/image";
import { TrophyIcon } from "@heroicons/react/24/outline";
import { getSkills } from "@/services/aboutService";

export default async function SkillsSection() {
  const skills = await getSkills();

  return (
    <div className="mt-10">
      <h2 className="m-3 flex items-center text-2xl font-thin text-white lg:text-3xl">
        <TrophyIcon className="mr-4 h-auto w-10 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.4)]" />
        HABILIDADES TÉCNICAS
      </h2>
      <div className="mt-10 grid grid-cols-4 gap-4">
        {skills.map(skill => (
          <div key={skill.id} className="flex flex-col items-center">
            <Image src={skill.icon} alt={skill.name} height={64} width={64} className="h-16 w-16" />
            <p className="text-center text-sm font-thin text-white">{skill.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
